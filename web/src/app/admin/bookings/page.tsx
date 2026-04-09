'use client';

import { Button, Card, Space, Table, Tag, Typography, message, Modal, Spin, Descriptions, Divider } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const formatVND = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

const statusConfig: Record<string, { color: string; label: string }> = {
    PENDING:   { color: 'orange', label: 'Chờ xử lý' },
    CONFIRMED: { color: 'blue',   label: 'Đã xác nhận' },
    PAID:      { color: 'green',  label: 'Đã thanh toán' },
    CANCELLED: { color: 'red',    label: 'Đã hủy' },
};

const typeConfig: Record<string, { color: string; label: string }> = {
    TOUR:   { color: 'gold',  label: '🗺️ Tour' },
    FLIGHT: { color: 'blue',  label: '✈️ Chuyến bay' },
    HOTEL:  { color: 'cyan',  label: '🏨 Khách sạn' },
};

export default function AdminBookingsPage() {
    const { data: session, status } = useSession();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{ id: string; newStatus: string; label: string } | null>(null);
    const [confirming, setConfirming] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            router.push('/');
            message.error('Bạn không có quyền truy cập trang này');
        }
    }, [status, session, router]);

    const fetchBookings = () => {
        if (status !== 'authenticated' || session?.user?.role !== 'ADMIN') return;
        setLoading(true);
        fetch('/api/bookings')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setBookings(data);
                } else {
                    message.error('Lỗi tải danh sách đơn hàng');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
            fetchBookings();
        }
    }, [status, session]);

    // Table row action: open confirm modal (state-based, not Modal.confirm)
    const handleUpdateStatus = (id: string, newStatus: string) => {
        setConfirmModal({ id, newStatus, label: statusConfig[newStatus]?.label || newStatus });
    };

    // Confirm modal OK handler
    const handleConfirmOk = async () => {
        if (!confirmModal) return;
        setConfirming(true);
        try {
            const res = await fetch(`/api/bookings/${confirmModal.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: confirmModal.newStatus })
            });
            if (res.ok) { message.success('Cập nhật thành công'); fetchBookings(); }
            else { message.error('Cập nhật thất bại'); }
        } catch { message.error('Lỗi kết nối'); }
        finally { setConfirming(false); setConfirmModal(null); }
    };

    // Detail modal footer: direct update, no second confirm
    const handleDirectUpdate = async (id: string, newStatus: string) => {
        setIsDetailModalVisible(false);
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) { message.success('Cập nhật thành công'); fetchBookings(); }
            else { message.error('Cập nhật thất bại'); }
        } catch { message.error('Lỗi kết nối'); }
    };

    const handleViewDetail = (record: any) => {
        setSelectedBooking(record);
        setIsDetailModalVisible(true);
    };


    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
            render: (id: number) => <Text copyable strong>#BK-{id}</Text>
        },
        {
            title: 'Khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
            render: (text: string, record: any) => (
                <div>
                    <Text strong>{text}</Text><br />
                    <Text type="secondary">{record.customerPhone}</Text>
                </div>
            )
        },
        {
            title: 'Dịch vụ',
            key: 'service',
            render: (_: any, record: any) => (
                <div>
                    <Tag color={typeConfig[record.type]?.color}>{typeConfig[record.type]?.label || record.type}</Tag>
                    <div style={{ marginTop: 4 }}>
                        <Text strong>{record.itemName}</Text>
                    </div>
                </div>
            )
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'finalPrice',
            key: 'finalPrice',
            render: (price: number) => <Text strong style={{ color: '#faad14' }}>{formatVND(price)}</Text>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (s: string) => {
                const cfg = statusConfig[s] || { color: 'default', label: s };
                return <Tag color={cfg.color}>{cfg.label}</Tag>;
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => (
                <Space vertical size="small">
                    <Button
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleViewDetail(record)}
                    >
                        Chi tiết
                    </Button>
                    {record.status === 'PENDING' && (
                        <>
                            <Button type="primary" size="small" onClick={() => handleUpdateStatus(record.id, 'CONFIRMED')}>Duyệt đơn</Button>
                            <Button danger size="small" onClick={() => handleUpdateStatus(record.id, 'CANCELLED')}>Hủy đơn</Button>
                        </>
                    )}
                    {record.status === 'CONFIRMED' && (
                        <Button style={{ borderColor: '#52c41a', color: '#52c41a' }} size="small" onClick={() => handleUpdateStatus(record.id, 'PAID')}>Xác nhận thanh toán</Button>
                    )}
                </Space>
            )
        }
    ];

    if (status === 'loading' || (status === 'authenticated' && session?.user?.role !== 'ADMIN')) {
        return (
            <div style={{ textAlign: 'center', padding: '100px' }}>
                <Spin size="large" tip="Đang kiểm tra quyền truy cập...">
                    <div style={{ height: 50 }} />
                </Spin>
            </div>
        );
    }

    if (status === 'unauthenticated') return null;

    return (
        <div style={{ padding: 24 }}>
            <Card title={<Title level={3}>Quản lý Đơn hàng</Title>}>
                <Table
                    columns={columns}
                    dataSource={bookings}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            {/* ===== ADMIN DETAIL MODAL ===== */}
            <Modal
                title={
                    <Space>
                        <EyeOutlined style={{ color: '#1677ff' }} />
                        <span>Chi tiết đơn #{selectedBooking?.id}</span>
                        {selectedBooking && (
                            <Tag color={statusConfig[selectedBooking.status]?.color} style={{ marginLeft: 8 }}>
                                {statusConfig[selectedBooking.status]?.label}
                            </Tag>
                        )}
                    </Space>
                }
                open={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={
                    <Space>
                        <Button onClick={() => setIsDetailModalVisible(false)}>Đóng</Button>
                        {selectedBooking?.status === 'PENDING' && (
                            <>
                                <Button type="primary"
                                    onClick={() => handleDirectUpdate(selectedBooking.id, 'CONFIRMED')}>
                                    Duyệt đơn
                                </Button>
                                <Button danger
                                    onClick={() => handleDirectUpdate(selectedBooking.id, 'CANCELLED')}>
                                    Hủy đơn
                                </Button>
                            </>
                        )}
                        {selectedBooking?.status === 'CONFIRMED' && (
                            <Button style={{ borderColor: '#52c41a', color: '#52c41a' }}
                                onClick={() => handleDirectUpdate(selectedBooking.id, 'PAID')}>
                                Xác nhận thanh toán
                            </Button>
                        )}
                    </Space>
                }
                style={{ top: 120 }}
                zIndex={9999}
                width={680}
            >
                {selectedBooking && (
                    <div>
                        {/* === Thông tin khách hàng === */}
                        <Divider titlePlacement="left">👤 Thông tin khách hàng</Divider>
                        <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
                            <Descriptions.Item label="Họ tên" span={1}><Text strong>{selectedBooking.customerName}</Text></Descriptions.Item>
                            <Descriptions.Item label="SĐT" span={1}>{selectedBooking.customerPhone}</Descriptions.Item>
                            {selectedBooking.user && (
                                <>
                                    <Descriptions.Item label="Email" span={2}>{selectedBooking.user.email}</Descriptions.Item>
                                </>
                            )}
                        </Descriptions>

                        {/* === Thông tin đơn hàng === */}
                        <Divider titlePlacement="left">📋 Thông tin đơn hàng</Divider>
                        <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
                            <Descriptions.Item label="Loại dịch vụ">
                                <Tag color={typeConfig[selectedBooking.type]?.color}>{typeConfig[selectedBooking.type]?.label || selectedBooking.type}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã đơn"><Text strong>#BK-{selectedBooking.id}</Text></Descriptions.Item>

                            <Descriptions.Item label="Tên dịch vụ" span={2}><Text strong>{selectedBooking.itemName}</Text></Descriptions.Item>

                            <Descriptions.Item label="Ngày đặt">{dayjs(selectedBooking.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                            <Descriptions.Item label="Số khách">{selectedBooking.totalPeople} người</Descriptions.Item>

                            {/* span=2 khi không có endDate để tránh lỗi column mismatch */}
                            <Descriptions.Item label="Ngày bắt đầu" span={selectedBooking.endDate ? 1 : 2}>
                                {dayjs(selectedBooking.startDate).format('DD/MM/YYYY')}
                            </Descriptions.Item>
                            {selectedBooking.endDate && (
                                <Descriptions.Item label="Ngày kết thúc">
                                    {dayjs(selectedBooking.endDate).format('DD/MM/YYYY')}
                                </Descriptions.Item>
                            )}

                            {/* HOTEL specific */}
                            {selectedBooking.type === 'HOTEL' && selectedBooking.seatClass && (
                                <Descriptions.Item label="Loại phòng" span={2}>
                                    <Tag color="cyan">{selectedBooking.seatClass === 'DOUBLE' ? 'Phòng đôi' : 'Phòng đơn'}</Tag>
                                </Descriptions.Item>
                            )}

                            {/* FLIGHT specific */}
                            {selectedBooking.type === 'FLIGHT' && selectedBooking.seatClass && (
                                <Descriptions.Item label="Hạng ghế" span={2}>
                                    <Tag color={selectedBooking.seatClass === 'BUSINESS' ? 'purple' : 'blue'}>
                                        {selectedBooking.seatClass === 'BUSINESS' ? 'Thương gia' : 'Phổ thông'}
                                    </Tag>
                                </Descriptions.Item>
                            )}
                        </Descriptions>

                        {/* TOUR COMBO BREAKDOWN */}
                        {selectedBooking.type === 'TOUR' && (
                            <>
                                {selectedBooking.hotel && (
                                    <>
                                        <Divider titlePlacement="left">🏨 Khách sạn kèm theo: {selectedBooking.hotel.name}</Divider>
                                        {(selectedBooking.singleRooms == null && selectedBooking.doubleRooms == null) ? (
                                            <div style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic', marginBottom: 12 }}>⚠️ Đơn hàng cũ — chi tiết phòng không được lưu.</div>
                                        ) : (
                                            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                                                <Card size="small" style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, textAlign: 'center' }}>
                                                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Phòng Đơn</div>
                                                    <div style={{ fontSize: 28, fontWeight: 700, color: '#1677ff', lineHeight: 1 }}>{selectedBooking.singleRooms ?? 0}</div>
                                                    <div style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0' }}>phòng × {formatVND(selectedBooking.hotel.price)}</div>
                                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{formatVND((selectedBooking.hotel.price || 0) * (selectedBooking.singleRooms ?? 0))}</div>
                                                </Card>
                                                <Card size="small" style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, textAlign: 'center' }}>
                                                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Phòng Đôi</div>
                                                    <div style={{ fontSize: 28, fontWeight: 700, color: '#1677ff', lineHeight: 1 }}>{selectedBooking.doubleRooms ?? 0}</div>
                                                    <div style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0' }}>phòng × {formatVND((selectedBooking.hotel.price || 0) * 1.5)}</div>
                                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{formatVND((selectedBooking.hotel.price || 0) * 1.5 * (selectedBooking.doubleRooms ?? 0))}</div>
                                                </Card>
                                            </div>
                                        )}
                                    </>
                                )}

                                {selectedBooking.flight && (
                                    <>
                                        <Divider titlePlacement="left">✈️ Vé máy bay kèm theo: {selectedBooking.flight.name}</Divider>
                                        {(selectedBooking.economySeats == null && selectedBooking.businessSeats == null) ? (
                                            <div style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic', marginBottom: 12 }}>⚠️ Đơn hàng cũ — chi tiết ghế không được lưu.</div>
                                        ) : (
                                            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                                                <Card size="small" style={{ flex: 1, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, textAlign: 'center' }}>
                                                    <div style={{ fontSize: 12, color: '#0369a1', marginBottom: 4, fontWeight: 600 }}>Phổ thông (Khứ hồi)</div>
                                                    <div style={{ fontSize: 28, fontWeight: 700, color: '#0369a1', lineHeight: 1 }}>{selectedBooking.economySeats ?? 0}</div>
                                                    <div style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0' }}>ghế × {formatVND((selectedBooking.flight.price || 0) * 2)}</div>
                                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{formatVND((selectedBooking.flight.price || 0) * 2 * (selectedBooking.economySeats ?? 0))}</div>
                                                </Card>
                                                <Card size="small" style={{ flex: 1, background: '#faf5ff', border: '1px solid #d8b4fe', borderRadius: 10, textAlign: 'center' }}>
                                                    <div style={{ fontSize: 12, color: '#7c3aed', marginBottom: 4, fontWeight: 600 }}>Thương gia (Khứ hồi)</div>
                                                    <div style={{ fontSize: 28, fontWeight: 700, color: '#7c3aed', lineHeight: 1 }}>{selectedBooking.businessSeats ?? 0}</div>
                                                    <div style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0' }}>ghế × {formatVND((selectedBooking.flight.price || 0) * 3)}</div>
                                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{formatVND((selectedBooking.flight.price || 0) * 3 * (selectedBooking.businessSeats ?? 0))}</div>
                                                </Card>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        {/* === Thanh toán === */}
                        <Divider titlePlacement="left">💰 Thanh toán</Divider>
                        <div style={{ background: '#fafafa', borderRadius: 10, padding: '12px 16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <Text type="secondary">Giá gốc:</Text>
                                <Text>{formatVND(selectedBooking.price)}</Text>
                            </div>
                            {selectedBooking.discountAmount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <Text type="secondary">
                                        Giảm giá {selectedBooking.voucherCode && <Tag color="green" style={{ marginLeft: 4 }}>{selectedBooking.voucherCode}</Tag>}:
                                    </Text>
                                    <Text style={{ color: '#52c41a' }}>- {formatVND(selectedBooking.discountAmount)}</Text>
                                </div>
                            )}
                            <Divider style={{ margin: '8px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text strong style={{ fontSize: 16 }}>Tổng cộng:</Text>
                                <Text strong style={{ fontSize: 20, color: '#faad14' }}>{formatVND(selectedBooking.finalPrice)}</Text>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* ===== STATE-BASED CONFIRMATION MODAL (replaces imperative Modal.confirm) ===== */}
            <Modal
                title="❗ Xác nhận thao tác"
                open={!!confirmModal}
                onCancel={() => setConfirmModal(null)}
                onOk={handleConfirmOk}
                okText="Đồng ý"
                cancelText="Hủy"
                okButtonProps={{ loading: confirming }}
                style={{ top: 300 }}
                zIndex={9999}
                width={420}
            >
                <p>Bạn có chắc muốn chuyển trạng thái đơn hàng này sang
                    <strong> "{confirmModal?.label}"</strong>?
                </p>
            </Modal>
        </div>
    );
}
