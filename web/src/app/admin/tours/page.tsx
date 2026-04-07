'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, Tag, Typography, message, Card, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function AdminToursPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTour, setEditingTour] = useState<any>(null);
    const [searchText, setSearchText] = useState('');
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
        { 
            title: 'Tour', 
            key: 'tour',
            render: (_: any, record: any) => (
                <Space>
                    <img src={record.image} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} alt="" />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{record.name}</div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.duration}</div>
                    </div>
                </Space>
            )
        },
        { title: 'Địa điểm', dataIndex: 'location', key: 'location' },
        { 
            title: 'Giá tiền', 
            dataIndex: 'price', 
            key: 'price',
            render: (p: number) => <span style={{ color: '#f5222d', fontWeight: 'bold' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)}</span>
        },
        { 
            title: 'Loại hình', 
            dataIndex: 'category', 
            key: 'category',
            render: (cat: string) => (
                <Tag color={cat === 'DOMESTIC' ? 'cyan' : 'purple'} style={{ borderRadius: 10, padding: '0 12px' }}>
                    {cat === 'DOMESTIC' ? 'Trong nước' : 'Quốc tế'}
                </Tag>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            render: (_: any, record: any) => (
                <Space>
                    <Button type="text" icon={<EditOutlined style={{ color: '#1890ff' }} />} onClick={() => handleEdit(record)} />
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ];

    if (session?.user?.role !== 'ADMIN') return null;

    return (
        <div style={{ padding: 24, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <Card 
                variant="borderless"
                style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                        <div>
                            <Title level={3} style={{ margin: 0 }}>Quản lý Sản phẩm Tour</Title>
                            <Text type="secondary">Cấu hình thông tin Tour, Khách sạn và Máy bay đi kèm</Text>
                        </div>
                        <Space size="large">
                            <Input 
                                placeholder="Tìm kiếm tour..." 
                                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
                                style={{ width: 300, borderRadius: 8, height: 45 }}
                                onChange={(e) => setSearchText(e.target.value)}
                                allowClear
                            />
                            <Button type="primary" size="large" icon={<PlusOutlined />} onClick={handleAdd} style={{ borderRadius: 8, height: 45, padding: '0 24px' }}>
                                Tạo Tour Mới
                            </Button>
                        </Space>
                    </div>
                }
            >
                <Table 
                    dataSource={tours.filter((t: any) => 
                        t.name?.toLowerCase().includes(searchText.toLowerCase()) || 
                        t.location?.toLowerCase().includes(searchText.toLowerCase())
                    )} 
                    columns={columns} 
                    rowKey="id" 
                    loading={loading}
                    pagination={{ pageSize: 8, showSizeChanger: false }}
                />
            </Card>

            <Modal
                title={
                    <div style={{ paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                        <Title level={4} style={{ margin: 0 }}>{editingTour ? "Cập nhật thông tin Tour" : "Khởi tạo Tour mới"}</Title>
                    </div>
                }
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                width={900}
                okText="Lưu thay đổi"
                cancelText="Hủy bỏ"
                centered
                okButtonProps={{ size: 'large', style: { borderRadius: 8, padding: '0 32px' } }}
                cancelButtonProps={{ size: 'large', style: { borderRadius: 8 } }}
            >
                <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
                    <Row gutter={24}>
                        <Col span={16}>
                            <Form.Item name="name" label="Tên Tour (Tiêu đề hiển thị)" rules={[{ required: true, message: 'Vui lòng nhập tên tour' }]}>
                                <Input placeholder="Ví dụ: Tour Khám Phá Đà Lạt 3N2Đ" size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="duration" label="Thời gian" rules={[{ required: true }]}>
                                <Input placeholder="Ví dụ: 3N2Đ, 4N3Đ" size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name="location" label="Điểm đến (Thành phố/Tỉnh)" rules={[{ required: true }]}>
                                <Input placeholder="Ví dụ: Đà Lạt, Phú Quốc..." size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="price" label="Giá trọn gói (VNĐ)" rules={[{ required: true }]}>
                                <InputNumber 
                                    style={{ width: '100%' }} 
                                    size="large"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="category" label="Phân vùng" rules={[{ required: true }]}>
                                <Select size="large" options={[{ value: 'DOMESTIC', label: 'Trong nước' }, { value: 'INTERNATIONAL', label: 'Quốc tế' }]} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="image" label="Đường dẫn ảnh đại diện (URL)">
                        <Input placeholder="https://images.unsplash.com/..." size="large" />
                    </Form.Item>

                    <Form.Item name="description" label="Giới thiệu ngắn về Tour">
                        <Input.TextArea rows={4} placeholder="Mô tả sự hấp dẫn của tour..." />
                    </Form.Item>

                    <Card size="small" title="Cấu hình nâng cao" style={{ backgroundColor: '#fafafa', marginBottom: 24 }}>
                        <Form.Item name="itinerary" label="Lịch trình chi tiết (Dạng JSON)" style={{ marginBottom: 0 }}>
                            <Input.TextArea 
                                rows={6} 
                                placeholder='[{"day": 1, "title": "...", "activities": ["...", "..."]}]' 
                                style={{ fontFamily: 'monospace', fontSize: 12 }}
                            />
                        </Form.Item>
                        <div style={{ marginTop: 8, fontSize: 11, color: '#8c8c8c' }}>
                            * Lưu ý: Hệ thống sẽ tự động ghép với Khách sạn và Chuyến bay dựa trên **Điểm đến** đã nhập ở trên.
                        </div>
                    </Card>
                </Form>
            </Modal>
        </div>
    );
}
