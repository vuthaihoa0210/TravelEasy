'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, Tag, Typography, message, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function AdminHotelsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingHotel, setEditingHotel] = useState<any>(null);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/auth/signin');
        else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            router.push('/');
            message.error('Không có quyền truy cập');
        }
    }, [status, session, router]);

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/hotels');
            if (res.ok) {
                let data: any = [];
                try { data = await res.json(); } catch { /* non-JSON */ }
                setHotels(data);
            }
        } catch (error) {
            message.error('Lỗi tải dữ liệu');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (session?.user?.role === 'ADMIN') fetchHotels();
    }, [session]);

    const handleAdd = () => {
        setEditingHotel(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: any) => {
        setEditingHotel(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa khách sạn này?',
            onOk: async () => {
                try {
                    const res = await fetch(`/api/hotels/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        message.success('Xóa thành công');
                        fetchHotels();
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
            const method = editingHotel ? 'PUT' : 'POST';
            const url = editingHotel ? `/api/hotels/${editingHotel.id}` : '/api/hotels';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            });

            if (res.ok) {
                message.success(editingHotel ? 'Cập nhật thành công' : 'Thêm mới thành công');
                setIsModalVisible(false);
                fetchHotels();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        { title: 'Tên Khách Sạn', dataIndex: 'name', key: 'name' },
        { title: 'Địa điểm', dataIndex: 'location', key: 'location' },
        { 
            title: 'Giá/Đêm', 
            dataIndex: 'price', 
            key: 'price',
            render: (p: number) => <b>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)}</b>
        },
        { 
            title: 'Loại', 
            dataIndex: 'category', 
            key: 'category',
            render: (cat: string) => <Tag color={cat === 'DOMESTIC' ? 'green' : 'blue'}>{cat}</Tag>
        },
        { title: 'Phòng Đơn', dataIndex: 'availableSingle', key: 'availableSingle' },
        { title: 'Phòng Đôi', dataIndex: 'availableDouble', key: 'availableDouble' },
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
            <Card 
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={3} style={{ margin: 0 }}>Quản lý Khách Sạn</Title>
                        <Space>
                            <Input 
                                placeholder="Tìm khách sạn..." 
                                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
                                style={{ width: 250 }}
                                onChange={(e) => setSearchText(e.target.value)}
                                allowClear
                            />
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm Khách Sạn</Button>
                        </Space>
                    </div>
                }
            >
                <Table 
                    dataSource={hotels.filter((h: any) => 
                        h.name?.toLowerCase().includes(searchText.toLowerCase()) || 
                        h.location?.toLowerCase().includes(searchText.toLowerCase())
                    )} 
                    columns={columns} 
                    rowKey="id" 
                    loading={loading} 
                />
            </Card>

            <Modal
                title={editingHotel ? "Sửa Khách Sạn" : "Thêm Khách Sạn Mới"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Tên Khách Sạn" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="location" label="Địa điểm" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item name="price" label="Giá mỗi đêm" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                        </Form.Item>
                        <Form.Item name="category" label="Loại" rules={[{ required: true }]}>
                            <Select options={[{ value: 'DOMESTIC', label: 'Trong nước' }, { value: 'INTERNATIONAL', label: 'Quốc tế' }]} />
                        </Form.Item>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item name="availableSingle" label="Số phòng đơn còn trống" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                        <Form.Item name="availableDouble" label="Số phòng đôi còn trống" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                    </div>
                    <Form.Item name="image" label="Link Ảnh">
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
