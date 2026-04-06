'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Card, Avatar, Typography, Button, Descriptions, Tag, Spin,
  Tabs, Empty, Row, Col, Statistic, Badge, Modal
} from 'antd';
import {
  UserOutlined, MailOutlined, CrownOutlined, CalendarOutlined,
  LogoutOutlined, ShoppingOutlined, GiftOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text, Paragraph } = Typography;

interface Booking {
  id: string;
  type: string;
  itemId: string;
  itemName?: string;
  status: string;
  price: number;
  finalPrice: number;
  discountAmount: number;
  createdAt: string;
  customerName?: string;
  customerPhone?: string;
  totalPeople?: number;
  seatClass?: string;
  startDate?: string;
  endDate?: string;
  subBookings?: Booking[];
}


const formatCurrency = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const statusColor: Record<string, string> = {
  PENDING: 'orange',
  CONFIRMED: 'blue',
  PAID: 'green',
  CANCELLED: 'red',
  COMPLETED: 'cyan',
};

const statusLabel: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PAID: 'Đã thanh toán',
  CANCELLED: 'Đã hủy',
  COMPLETED: 'Hoàn thành',
};

const typeIcon: Record<string, string> = {
  HOTEL: '🏨',
  TOUR: '🗺️',
  FLIGHT: '✈️',
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleBookingClick = (b: Booking) => {
    setSelectedBooking(b);
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const userId = (session?.user as any)?.id;
    if (!userId) return;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/bookings/user/${userId}`)
      .then(r => r.json())
      .then(b => { 
        const items = Array.isArray(b) ? b : [];
        if (items.length > 0) {
          items.sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime());
          const grouped: Booking[] = [];
          items.forEach(booking => {
            const last = grouped[grouped.length - 1];
            const isSameOrder = last && 
                last.type === booking.type && 
                last.itemId === booking.itemId && 
                Math.abs(new Date(last.createdAt).getTime() - new Date(booking.createdAt).getTime()) < 5000;
                
            if (isSameOrder) {
              last.subBookings!.push(booking);
              last.finalPrice = (last.finalPrice || 0) + (booking.finalPrice || booking.price || 0);
              last.discountAmount = (last.discountAmount || 0) + (booking.discountAmount || 0);
              last.price = (last.price || 0) + (booking.price || 0);
              
              if (last.type === 'FLIGHT') {
                last.itemName = last.itemName?.replace(' (Chiều đi)', '')?.replace(' (Chiều về)', '') + ' (Khứ hồi)';
              } else if (last.type === 'HOTEL') {
                last.itemName = last.itemName?.includes('Nhiều phòng') ? last.itemName : `${last.itemName} (Nhiều phòng)`;
              }
            } else {
              grouped.push({
                ...booking,
                finalPrice: booking.finalPrice || booking.price || 0,
                subBookings: [booking]
              });
            }
          });
          setBookings(grouped);
        } else {
          setBookings([]);
        }
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, [status, session]);

  if (status === 'loading' || loading) {
    return <div style={{ textAlign: 'center', padding: '120px 0' }}><Spin size="large" /></div>;
  }

  if (!session) return null;

  const user = session.user as any;
  const completedBookings = bookings.filter(b => b.status === 'PAID' || b.status === 'COMPLETED');

  // Avatar initials
  const initials = (user.name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const avatarColor = user.role === 'ADMIN' ? '#1677ff' : '#52c41a';

  const tabItems = [
    {
      key: 'bookings',
      label: <span><ShoppingOutlined /> Lịch sử đặt đơn {bookings.length > 0 ? `(${bookings.length})` : ''}</span>,
      children: bookings.length === 0 ? (
        <Empty description="Bạn chưa có đặt đơn nào" image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Link href="/hotels"><Button type="primary">Đặt ngay</Button></Link>
        </Empty>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bookings.map(b => (
            <Card 
              key={b.id} 
              size="small" 
              style={{ borderRadius: 12 }} 
              hoverable 
              onClick={() => handleBookingClick(b)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 28 }}>{typeIcon[b.type] || '📦'}</span>
                  <div>
                    <Text strong style={{ fontSize: 14 }}>
                      {b.itemName || `Đơn #${String(b.id).slice(-8).toUpperCase()}`}
                    </Text>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                      <Tag color={statusColor[b.status] || 'default'}>{statusLabel[b.status] || b.status}</Tag>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        <CalendarOutlined /> {new Date(b.createdAt).toLocaleDateString('vi-VN')}
                      </Text>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#1677ff', fontSize: 16 }}>
                    {formatCurrency(b.finalPrice || b.price || 0)}
                  </div>
                  {b.discountAmount > 0 && (
                    <div style={{ fontSize: 12, color: '#52c41a' }}>Tiết kiệm {formatCurrency(b.discountAmount)}</div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '120px auto 40px', padding: '0 24px' }}>
      {/* Profile header card */}
      <Card
        style={{
          borderRadius: 20, marginBottom: 24,
          background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
          border: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <Avatar
            size={88}
            style={{ background: '#fff', color: avatarColor, fontSize: 32, fontWeight: 800, flexShrink: 0 }}
          >
            {initials}
          </Avatar>
          <div style={{ flex: 1, color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <Title level={3} style={{ color: '#fff', margin: 0 }}>{user.name}</Title>
              {user.role === 'ADMIN' && (
                <Tag color="gold" icon={<CrownOutlined />} style={{ fontWeight: 700 }}>Admin</Tag>
              )}
            </div>
            <Text style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginTop: 4 }}>
              <MailOutlined /> {user.email}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              Thành viên TravelEasy
            </Text>
          </div>
          <Button
            icon={<LogoutOutlined />}
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)', color: '#fff' }}
          >
            Đăng xuất
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8}>
          <Card style={{ borderRadius: 16, textAlign: 'center' }}>
            <Statistic title="Tổng đặt chỗ" value={bookings.length} prefix={<ShoppingOutlined style={{ color: '#1677ff' }} />} />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card style={{ borderRadius: 16, textAlign: 'center' }}>
            <Statistic title="Đã hoàn thành" value={completedBookings.length} prefix={<span style={{ color: '#52c41a' }}>✅</span>} />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card style={{ borderRadius: 16, textAlign: 'center' }}>
            <Statistic title="Xem ưu đãi" value="🎟️" prefix={<Link href="/vouchers"><Button size="small" type="link">Xem ngay</Button></Link>} />
          </Card>
        </Col>
      </Row>

      {/* Account info */}
      <Card style={{ borderRadius: 16, marginBottom: 24 }} title={<span><UserOutlined /> Thông tin tài khoản</span>}>
        <Descriptions column={{ xs: 1, sm: 2 }} size="middle">
          <Descriptions.Item label="Họ và tên">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            <Tag color={user.role === 'ADMIN' ? 'gold' : 'blue'}>
              {user.role === 'ADMIN' ? '👑 Admin' : '👤 Thành viên'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Badge status="success" text="Đang hoạt động" />
          </Descriptions.Item>
        </Descriptions>
        {user.role === 'ADMIN' && (
          <div style={{ marginTop: 16 }}>
            <Link href="/admin/bookings">
              <Button type="primary" icon={<CrownOutlined />}>Vào trang Quản trị</Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Bookings & Vouchers tabs */}
      <Card style={{ borderRadius: 16 }}>
        <Tabs key={bookings.length} items={tabItems} size="large" />
      </Card>

      <Modal
        title={<span><ShoppingOutlined /> Chi tiết đơn hàng</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)} type="primary">
            Đóng
          </Button>,
        ]}
        width={600}
        centered
      >
        {selectedBooking && (
          <>
            <Descriptions column={1} bordered size="small" style={{ marginTop: 16 }}>
              <Descriptions.Item label="Mã đơn hàng">
                <Text strong copyable>#{String(selectedBooking.id).slice(-8).toUpperCase()}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Dịch vụ">
                <span style={{ fontSize: 16, marginRight: 8 }}>{typeIcon[selectedBooking.type]}</span>
                <Text strong>{selectedBooking.itemName}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={statusColor[selectedBooking.status] || 'default'}>
                  {statusLabel[selectedBooking.status] || selectedBooking.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo đơn">
                {new Date(selectedBooking.createdAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Họ tên người đặt">
                {selectedBooking.customerName || (session?.user as any)?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedBooking.customerPhone || 'Chưa cập nhật'}
              </Descriptions.Item>
            </Descriptions>

            {selectedBooking.subBookings && selectedBooking.subBookings.map((sub, index) => (
               <Descriptions key={sub.id} column={1} bordered size="small" style={{ marginTop: 16 }} title={<Text strong style={{ fontSize: 14 }}>Chi tiết #{index + 1}: {sub.itemName}</Text>}>
                <Descriptions.Item label="Ngày bắt đầu">
                  {sub.startDate ? new Date(sub.startDate).toLocaleDateString('vi-VN') : 'N/A'}
                </Descriptions.Item>
                {sub.endDate && (
                  <Descriptions.Item label="Ngày kết thúc">
                    {new Date(sub.endDate).toLocaleDateString('vi-VN')}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label={sub.type === 'HOTEL' ? 'Số phòng' : 'Số người'}>
                  {sub.totalPeople || 1}
                </Descriptions.Item>
                {sub.seatClass && (
                  <Descriptions.Item label={sub.type === 'HOTEL' ? 'Loại phòng' : 'Hạng ghế'}>
                    {sub.seatClass}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Giá dịch vụ">
                  <Text strong>{formatCurrency(sub.price || 0)}</Text>
                </Descriptions.Item>
               </Descriptions>
            ))}

            <Descriptions column={1} bordered size="small" style={{ marginTop: 16 }}>
              {selectedBooking.discountAmount > 0 && (
                <Descriptions.Item label="Giảm giá">
                  <Text type="success">-{formatCurrency(selectedBooking.discountAmount)}</Text>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Tổng thanh toán">
                <Text strong style={{ color: '#1677ff', fontSize: 16 }}>
                  {formatCurrency(selectedBooking.finalPrice || selectedBooking.price || 0)}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
}
