'use client';

import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Card, Layout, Spin, message, Empty, Button, Modal, QRCode, Space, Alert, Descriptions, Divider } from 'antd';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { RocketOutlined, HistoryOutlined, EyeOutlined, CreditCardOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

interface Booking {
    id: number;
    itemName: string;
    type: string;
    startDate: string;
    endDate?: string;
    price: number;
    finalPrice: number;
    discountAmount: number;
    voucherCode?: string;
    status: string;
    createdAt: string;
    customerName: string;
    customerPhone: string;
    totalPeople: number;
    seatClass?: string;
    singleRooms?: number | null;
    doubleRooms?: number | null;
    economySeats?: number | null;
    businessSeats?: number | null;
    flight?: { name: string; code: string; price: number };
    hotel?: { name: string; price: number };
}

const formatVND = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

const statusConfig: Record<string, { color: string; label: string }> = {
    PENDING:   { color: 'gold',  label: 'Đang chờ' },
    CONFIRMED: { color: 'blue',  label: 'Đã xác nhận' },
    PAID:      { color: 'green', label: 'Đã thanh toán' },
    CANCELLED: { color: 'red',   label: 'Đã hủy' },
};

const typeConfig: Record<string, { color: string; label: string }> = {
    HOTEL:  { color: 'blue',  label: '🏨 Khách sạn' },
    FLIGHT: { color: 'green', label: '✈️ Chuyến bay' },
    TOUR:   { color: 'gold',  label: '🗺️ Tour' },
};

export default function BookingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/auth/signin');
    }, [status, router]);

    const fetchBookings = () => {
        if (session?.user?.id) {
            setLoading(true);
            fetch(`/api/bookings/user/${session.user.id}`)
                .then(res => res.json())
                .then(data => { if (Array.isArray(data)) setBookings(data); setLoading(false); })
                .catch(() => { message.error('Không thể tải danh sách đơn hàng'); setLoading(false); });
        }
    };

    useEffect(() => { fetchBookings(); }, [session]);

    const handleViewDetail = (booking: Booking) => { setSelectedBooking(booking); setIsDetailModalVisible(true); };
    const handlePayment   = (booking: Booking) => { setSelectedBooking(booking); setIsPaymentModalVisible(true); };

    const confirmPayment = async () => {
        if (!selectedBooking) return;
        setPaying(true);
        try {
            const res = await fetch(`/api/bookings/${selectedBooking.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'PAID' })
            });
            if (res.ok) {
                message.success('Thanh toán thành công!');
                setIsPaymentModalVisible(false);
                fetchBookings();
            } else { message.error('Thanh toán thất bại.'); }
        } catch { message.error('Lỗi kết nối máy chủ.'); }
        finally { setPaying(false); }
    };

    if (status === 'loading' || loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px' }}>
                <Spin size="large" tip="Đang tải lịch sử đơn hàng..."><div style={{ height: 50 }} /></Spin>
            </div>
        );
    }

    const columns = [
        {
            title: 'Dịch vụ', key: 'service',
            render: (_: any, r: Booking) => (
                <div>
                    <Text strong>{r.itemName}</Text>
                    <div style={{ marginTop: 4 }}>
                        <Tag color={typeConfig[r.type]?.color}>{typeConfig[r.type]?.label || r.type}</Tag>
                    </div>
                </div>
            )
        },
        {
            title: 'Ngày đặt', dataIndex: 'createdAt', key: 'createdAt',
            render: (d: string) => dayjs(d).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Tổng tiền', dataIndex: 'finalPrice', key: 'finalPrice',
            render: (p: number) => <Text type="danger" strong>{formatVND(p)}</Text>
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status',
            render: (s: string) => { const c = statusConfig[s] || { color: 'default', label: s }; return <Tag color={c.color}>{c.label}</Tag>; }
        },
        {
            title: 'Hành động', key: 'action',
            render: (_: any, r: Booking) => (
                <Space size="small" vertical>
                    <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewDetail(r)}>Xem chi tiết</Button>
                    {r.status === 'CONFIRMED' && (
                        <Button type="primary" icon={<CreditCardOutlined />} size="small"
                            onClick={() => handlePayment(r)}
                            style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                            Thanh toán ngay
                        </Button>
                    )}
                    {r.status === 'PAID' && <Text type="success" strong>✅ Đã thanh toán</Text>}
                </Space>
            )
        }
    ];

    return (
        <Content style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
            <Card
                style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                title={<Space><HistoryOutlined style={{ color: '#1677ff' }} /><Title level={3} style={{ margin: 0 }}>Lịch sử đơn hàng</Title></Space>}
            >
                {bookings.length === 0 ? (
                    <Empty description="Bạn chưa có đơn hàng nào." image={Empty.PRESENTED_IMAGE_SIMPLE}>
                        <Button type="primary" onClick={() => router.push('/')} icon={<RocketOutlined />}>Khám phá ngay</Button>
                    </Empty>
                ) : (
                    <Table dataSource={bookings} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
                )}
            </Card>

            {/* ===== DETAIL MODAL ===== */}
            <Modal
                title={<Space><EyeOutlined style={{ color: '#1677ff' }} /><span>Chi tiết đơn hàng #{selectedBooking?.id}</span>
                    {selectedBooking && <Tag color={statusConfig[selectedBooking.status]?.color} style={{ marginLeft: 8 }}>{statusConfig[selectedBooking.status]?.label}</Tag>}
                </Space>}
                open={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={
                    <Space>
                        <Button onClick={() => setIsDetailModalVisible(false)}>Đóng</Button>
                        {selectedBooking?.status === 'CONFIRMED' && (
                            <Button type="primary" icon={<CreditCardOutlined />}
                                style={{ background: '#52c41a', borderColor: '#52c41a' }}
                                onClick={() => { setIsDetailModalVisible(false); handlePayment(selectedBooking); }}>
                                Thanh toán ngay
                            </Button>
                        )}
                    </Space>
                }
                style={{ top: 120 }}
                zIndex={1200}
                width={660}
            >
                {selectedBooking && (
                    <div>
                        {/* Thông tin đơn hàng */}
                        <Divider titlePlacement="left">📋 Thông tin đơn hàng</Divider>
                        <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
                            <Descriptions.Item label="Loại dịch vụ">
                                <Tag color={typeConfig[selectedBooking.type]?.color}>{typeConfig[selectedBooking.type]?.label || selectedBooking.type}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã đơn"><Text strong>#BK-{selectedBooking.id}</Text></Descriptions.Item>

                            <Descriptions.Item label="Tên dịch vụ" span={2}><Text strong>{selectedBooking.itemName}</Text></Descriptions.Item>

                            <Descriptions.Item label="Ngày đặt">{dayjs(selectedBooking.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
                            <Descriptions.Item label="Số khách">{selectedBooking.totalPeople} người</Descriptions.Item>

                            {/* Ngày bắt đầu: span=2 nếu không có endDate để tránh lỗi column mismatch */}
                            <Descriptions.Item label="Ngày bắt đầu" span={selectedBooking.endDate ? 1 : 2}>
                                {dayjs(selectedBooking.startDate).format('DD/MM/YYYY')}
                            </Descriptions.Item>
                            {selectedBooking.endDate && (
                                <Descriptions.Item label="Ngày kết thúc">
                                    {dayjs(selectedBooking.endDate).format('DD/MM/YYYY')}
                                </Descriptions.Item>
                            )}

                            <Descriptions.Item label="Họ tên">{selectedBooking.customerName}</Descriptions.Item>
                            <Descriptions.Item label="SĐT">{selectedBooking.customerPhone}</Descriptions.Item>

                            {/* HOTEL */}
                            {selectedBooking.type === 'HOTEL' && selectedBooking.seatClass && (
                                <Descriptions.Item label="Loại phòng" span={2}>
                                    <Tag color="cyan">{selectedBooking.seatClass === 'DOUBLE' ? 'Phòng đôi' : 'Phòng đơn'}</Tag>
                                </Descriptions.Item>
                            )}
                            {/* FLIGHT */}
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
                                                    <div style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0' }}>ghế × {formatVND((selectedBooking.flight.price || 0) * 2 * 1.5)}</div>
                                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{formatVND((selectedBooking.flight.price || 0) * 2 * 1.5 * (selectedBooking.businessSeats ?? 0))}</div>
                                                </Card>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        {/* Thanh toán */}
                        <Divider titlePlacement="left">💰 Thanh toán</Divider>
                        <div style={{ background: '#fafafa', borderRadius: 10, padding: '12px 16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <Text type="secondary">Giá gốc:</Text>
                                <Text>{formatVND(selectedBooking.price)}</Text>
                            </div>
                            {(selectedBooking.discountAmount > 0) && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <Text type="secondary">Giảm giá {selectedBooking.voucherCode && <Tag color="green" style={{ marginLeft: 4 }}>{selectedBooking.voucherCode}</Tag>}:</Text>
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

            {/* ===== PAYMENT MODAL ===== */}
            <Modal
                title="💳 Thanh toán đơn hàng"
                open={isPaymentModalVisible}
                onCancel={() => setIsPaymentModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsPaymentModalVisible(false)}>Hủy</Button>,
                    <Button key="submit" type="primary" loading={paying} onClick={confirmPayment}
                        style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                        Tôi đã chuyển khoản thành công
                    </Button>,
                ]}
                style={{ top: 120 }}
                zIndex={1200}
            >
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Title level={4}>{selectedBooking?.itemName}</Title>
                    <Paragraph>
                        Số tiền cần thanh toán: <Text type="danger" strong style={{ fontSize: 20 }}>
                            {selectedBooking && formatVND(selectedBooking.finalPrice)}
                        </Text>
                    </Paragraph>
                    <div style={{ background: '#f5f5f5', padding: 20, borderRadius: 12, marginBottom: 20 }}>
                        <QRCode value={`PAYMENT_FOR_BOOKING_${selectedBooking?.id}`} size={200} style={{ margin: '0 auto' }} />
                        <div style={{ marginTop: 16 }}>
                            <Text strong>Quét mã QR để thanh toán qua Ngân hàng / Ví điện tử</Text><br />
                            <Text type="secondary">Nội dung chuyển khoản: <Text code>Traveleasy {selectedBooking?.id}</Text></Text>
                        </div>
                    </div>
                    <Alert description="Vui lòng kiểm tra kỹ số tiền và nội dung chuyển khoản trước khi xác nhận." type="warning" showIcon />
                </div>
            </Modal>
        </Content>
    );
}
