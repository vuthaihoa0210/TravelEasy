'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Typography, message, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function AdminBlogsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBlog, setEditingBlog] = useState<any>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/auth/signin');
        else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            router.push('/');
            message.error('Không có quyền truy cập');
        }
    }, [status, session, router]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/blogs');
            const data = await res.json();
            setBlogs(Array.isArray(data) ? data : []);
        } catch (error) {
            message.error('Lỗi tải dữ liệu');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (session?.user?.role === 'ADMIN') fetchBlogs();
    }, [session]);

    const handleAdd = () => {
        setEditingBlog(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: any) => {
        setEditingBlog(record);
        form.setFieldsValue({
            ...record,
            images: record.images?.join('\n')
        });
        setIsModalVisible(true);
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa bài viết này?',
            onOk: async () => {
                try {
                    const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        message.success('Xóa thành công');
                        fetchBlogs();
                    }
                } catch (error) {
                    message.error('Lỗi khi xóa');
                }
            }
        });
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                ...values,
                images: values.images ? values.images.split('\n').filter((url: string) => url.trim() !== '') : []
            };

            const method = editingBlog ? 'PUT' : 'POST';
            const url = editingBlog ? `/api/blogs/${editingBlog.id}` : '/api/blogs';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                message.success(editingBlog ? 'Cập nhật thành công' : 'Thêm mới thành công');
                setIsModalVisible(false);
                fetchBlogs();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        { title: 'Tiêu đề', dataIndex: 'title', key: 'title', render: (t: string) => <Text strong>{t}</Text> },
        { title: 'Tác giả', dataIndex: 'author', key: 'author' },
        { title: 'Ngày đăng', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => new Date(d).toLocaleDateString('vi-VN') },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ];

    if (session?.user?.role !== 'ADMIN') return null;

    return (
        <div style={{ padding: 24 }}>
            <Card title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={3} style={{ margin: 0 }}>Quản lý Bài viết Du lịch</Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Viết bài mới</Button>
                </div>
            }>
                <Table dataSource={blogs} columns={columns} rowKey="id" loading={loading} />
            </Card>

            <Modal
                title={editingBlog ? "Sửa Bài Viết" : "Tạo Bài Viết Mới"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                width={1000}
                style={{ top: 20 }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="title" label="Tiều đề bài viết" rules={[{ required: true }]}>
                        <Input placeholder="Ví dụ: Kinh nghiệm du lịch Đà Lạt..." />
                    </Form.Item>
                    <Form.Item name="author" label="Tác giả" initialValue="Admin">
                        <Input />
                    </Form.Item>
                    <Form.Item name="images" label="Danh sách Link Ảnh (Mỗi link một dòng)" help="Bài viết sẽ có Carousel ảnh nếu có nhiều link">
                        <Input.TextArea rows={4} placeholder="https://image1.jpg&#10;https://image2.jpg" />
                    </Form.Item>
                    <Form.Item name="content" label="Nội dung bài viết" rules={[{ required: true }]}>
                        <Input.TextArea rows={12} placeholder="Chia sẻ trải nghiệm..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
