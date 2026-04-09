'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, Tag, Typography, message, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function AdminFlightsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingFlight, setEditingFlight] = useState<any>(null);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/auth/signin');
        else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            router.push('/');
            message.error('Không có quyền truy cập');
        }
    }, [status, session, router]);

    const fetchFlights = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/flights');
            if (res.ok) {
                let data: any = [];
                try { data = await res.json(); } catch { /* non-JSON */ }
                setFlights(data);
            }
        } catch (error) {
            message.error('Lỗi tải dữ liệu');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (session?.user?.role === 'ADMIN') fetchFlights();
    }, [session]);

    const handleAdd = () => {
        setEditingFlight(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: any) => {
        setEditingFlight(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa chuyến bay này?',
            onOk: async () => {
                try {
                    const res = await fetch(`/api/flights/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        message.success('Xóa thành công');
                        fetchFlights();
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
            const method = editingFlight ? 'PUT' : 'POST';
            const url = editingFlight ? `/api/flights/${editingFlight.id}` : '/api/flights';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            });

            if (res.ok) {
                message.success(editingFlight ? 'Cập nhật thành công' : 'Thêm mới thành công');
                setIsModalVisible(false);
                fetchFlights();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        { title: 'Số hiệu', dataIndex: 'code', key: 'code', render: (c: string) => <b>{c}</b> },
        { title: 'Tên chuyến', dataIndex: 'name', key: 'name' },
        { title: 'Điểm đến', dataIndex: 'location', key: 'location' },
        { 
            title: 'Giá vé', 
            dataIndex: 'price', 
            key: 'price',
            render: (p: number) => <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)}</span>
        },
        { 
            title: 'Loại', 
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
                    <Title level={3} style={{ margin: 0 }}>Quản lý Vé Máy Bay</Title>
                    <Space>
                        <Input 
                            placeholder="Tìm chuyến bay..." 
                            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
                            style={{ width: 250 }}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm Chuyến Bay</Button>
                    </Space>
                </div>
            }>
                <Table 
                    dataSource={flights.filter((f: any) => 
                        f.name?.toLowerCase().includes(searchText.toLowerCase()) || 
                        f.code?.toLowerCase().includes(searchText.toLowerCase()) ||
                        f.location?.toLowerCase().includes(searchText.toLowerCase())
                    )} 
                    columns={columns} 
                    rowKey="id" 
                    loading={loading} 
                />
            </Card>

            <Modal
                title={editingFlight ? "Sửa Chuyến Bay" : "Thêm Chuyến Bay Mới"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 16 }}>
                        <Form.Item name="code" label="Mã hiệu" rules={[{ required: true }]}>
                            <Input placeholder="VN203" />
                        </Form.Item>
                        <Form.Item name="name" label="Tên Chuyến Bay" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <Form.Item name="location" label="Điểm đến" rules={[{ required: true }]}>
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
                </Form>
            </Modal>
        </div>
    );
}
