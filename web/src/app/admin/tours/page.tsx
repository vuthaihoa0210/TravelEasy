'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, Tag, Typography, message, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function AdminToursPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTour, setEditingTour] = useState<any>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/auth/signin');
        else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            router.push('/');
            message.error('Không có quyền truy cập');
        }
    }, [status, session, router]);

    const fetchTours = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/tours');
            const data = await res.json();
            setTours(data);
        } catch (error) {
            message.error('Lỗi tải dữ liệu');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (session?.user?.role === 'ADMIN') fetchTours();
    }, [session]);

    const handleAdd = () => {
        setEditingTour(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: any) => {
        setEditingTour(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa tour này?',
            onOk: async () => {
                try {
                    const res = await fetch(`/api/tours/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        message.success('Xóa thành công');
                        fetchTours();
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
            const method = editingTour ? 'PUT' : 'POST';
            const url = editingTour ? `/api/tours/${editingTour.id}` : '/api/tours';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            });

            if (res.ok) {
                message.success(editingTour ? 'Cập nhật thành công' : 'Thêm mới thành công');
                setIsModalVisible(false);
                fetchTours();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        { title: 'Tên Tour', dataIndex: 'name', key: 'name' },
        { title: 'Địa điểm', dataIndex: 'location', key: 'location' },
        { 
            title: 'Giá', 
            dataIndex: 'price', 
            key: 'price',
            render: (p: number) => <b>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)}</b>
        },
        { 
            title: 'Phân loại', 
            dataIndex: 'category', 
            key: 'category',
            render: (cat: string) => <Tag color={cat === 'DOMESTIC' ? 'green' : 'blue'}>{cat}</Tag>
        },
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
                    <Title level={3} style={{ margin: 0 }}>Quản lý Tour Du Lịch</Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm Tour</Button>
                </div>
            }>
                <Table dataSource={tours} columns={columns} rowKey="id" loading={loading} />
            </Card>

            <Modal
                title={editingTour ? "Sửa Tour" : "Thêm Tour Mới"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên Tour" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="location" label="Địa điểm" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                        </Form.Item>
                        <Form.Item name="category" label="Loại" rules={[{ required: true }]}>
                            <Select options={[{ value: 'DOMESTIC', label: 'Trong nước' }, { value: 'INTERNATIONAL', label: 'Quốc tế' }]} />
                        </Form.Item>
                    </div>
                    <Form.Item name="image" label="Link Ảnh">
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="itinerary" label="Lịch trình (JSON String)">
                        <Input.TextArea rows={6} placeholder='[{"day": 1, "title": "...", "activities": [...]}]' />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
