'use client';

import { Button, Card, Col, Input, Row, Space, Statistic, Steps, Tabs, Tag, Typography, Spin } from 'antd';
import { CompassOutlined, SearchOutlined, ThunderboltOutlined, SafetyOutlined, ClockCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const { Title, Paragraph, Text } = Typography;

interface Destination {
  id: number;
  name: string;
  description?: string;
  location?: string;
  price?: number;
  image?: string;
  rating?: number;
  category?: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1600&q=80',
    title: 'Khám phá Việt Nam tươi đẹp',
    subtitle: 'Hàng nghìn điểm đến hấp dẫn đang chờ bạn khám phá',
  },
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80',
    title: 'Đặt phòng khách sạn dễ dàng',
    subtitle: 'Hơn 1.200 khách sạn với giá tốt nhất, đảm bảo chất lượng',
  },
  {
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80',
    title: 'Bay tới mọi nơi trên thế giới',
    subtitle: 'Vé máy bay giá rẻ, đặt nhanh, thanh toán an toàn',
  },
  {
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80',
    title: 'Tour trọn gói hấp dẫn',
    subtitle: 'Lịch trình chi tiết, hướng dẫn viên nhiệt tình, giá minh bạch',
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80',
    title: 'Ưu đãi không thể bỏ lỡ',
    subtitle: 'Voucher giảm giá hấp dẫn, tiết kiệm tới 50% cho mọi chuyến đi',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchDest, setSearchDest] = useState('');
  const [hotels, setHotels] = useState<Destination[]>([]);
  const [tours, setTours] = useState<Destination[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch('/api/hotels').then(res => res.json()),
      fetch('/api/tours').then(res => res.json()),
      fetch('/api/blogs').then(res => res.json())
    ]).then(([hotelsData, toursData, blogsData]) => {
      setHotels(hotelsData);
      setTours(toursData);
      setBlogs(blogsData);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px 0' }}><Spin size="large" /></div>;
  }

  return (
    <>
      {/* ── HERO SLIDESHOW ── */}
      <div className="relative w-full h-[400px] md:h-[560px] overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${slide.image})`,
              opacity: idx === currentSlide ? 1 : 0,
              zIndex: idx === currentSlide ? 1 : 0,
            }}
          />
        ))}

        {/* Overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)'
        }} />

        {/* Slide text & buttons */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-4 pb-10 md:pb-20">
          <div className="text-3xl md:text-5xl font-extrabold leading-tight mb-4" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
            {slides[currentSlide].title}
          </div>
          <div className="text-base md:text-xl opacity-90 mb-8 max-w-2xl px-2" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            {slides[currentSlide].subtitle}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Link href="/flights" className="w-full sm:w-auto">
              <Button type="primary" size="large" icon={<SearchOutlined />}
                className="w-full h-12 text-base md:text-lg rounded-lg flex items-center justify-center">
                Bắt đầu tìm kiếm
              </Button>
            </Link>
            <Link href="/vouchers" className="w-full sm:w-auto">
              <Button size="large" ghost
                className="w-full h-12 text-base md:text-lg rounded-lg border-white text-white flex items-center justify-center">
                Xem ưu đãi
              </Button>
            </Link>
          </div>
        </div>

        {/* Prev arrow */}
        <button onClick={() => setCurrentSlide(p => (p - 1 + slides.length) % slides.length)}
          style={{
            position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
            zIndex: 20, background: 'rgba(255,255,255,0.22)', border: 'none', borderRadius: '50%',
            width: 46, height: 46, cursor: 'pointer', fontSize: 24, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>‹</button>

        {/* Next arrow */}
        <button onClick={() => setCurrentSlide(p => (p + 1) % slides.length)}
          style={{
            position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
            zIndex: 20, background: 'rgba(255,255,255,0.22)', border: 'none', borderRadius: '50%',
            width: 46, height: 46, cursor: 'pointer', fontSize: 24, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>›</button>

        {/* Dots */}
        <div style={{
          position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, display: 'flex', gap: 8,
        }}>
          {slides.map((_, idx) => (
            <div key={idx} onClick={() => setCurrentSlide(idx)} style={{
              width: idx === currentSlide ? 24 : 8, height: 8, borderRadius: 4, cursor: 'pointer',
              background: idx === currentSlide ? '#fff' : 'rgba(255,255,255,0.45)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </div>

      {/* ── SEARCH CARD (floating below banner) ── */}
      <div className="bg-[#f0f4f8] px-4 md:px-6 pb-8">
        <div className="max-w-[720px] mx-auto bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-4 md:p-8 -mt-11 relative z-[5]">
          <div className="font-bold text-lg mb-4 text-[#1677ff]">
            🔍 Tìm điểm đến của bạn
          </div>
          <div className="flex flex-col md:flex-row w-full gap-3 md:gap-0">
            <Input
              size="large"
              placeholder="Điểm đến (Đà Nẵng...)"
              prefix={<CompassOutlined />}
              value={searchDest}
              onChange={(e) => setSearchDest(e.target.value)}
              onPressEnter={() => {
                if (searchDest.trim()) router.push(`/hotels?search=${encodeURIComponent(searchDest.trim())}`);
                else router.push('/hotels');
              }}
              style={{ width: '100%' }}
              className="h-13 md:h-12 rounded-lg md:rounded-r-none border-[#d9d9d9]"
            />
            <Button type="primary" size="large" icon={<SearchOutlined />}
              onClick={() => {
                if (searchDest.trim()) router.push(`/hotels?search=${encodeURIComponent(searchDest.trim())}`);
                else router.push('/hotels');
              }}
              className="w-full md:w-auto h-12 md:rounded-l-none mt-2 md:mt-0"
              style={{ borderRadius: '8px' }}
            >
              Tìm kiếm
            </Button>
          </div>
          <div className="flex justify-between sm:justify-start flex-wrap gap-4 md:gap-10 mt-6">
            <Statistic title="Khách sạn" value={1200} styles={{ content: { fontSize: 20 } }} />
            <Statistic title="Tour đã đặt" value={5600} styles={{ content: { fontSize: 20 } }} />
            <Statistic title="Đánh giá 5★" value={4800} styles={{ content: { fontSize: 20 } }} />
          </div>
        </div>
      </div>

      <div className="section">
        <Title level={3}>Khách sạn nổi bật</Title>
        <Paragraph type="secondary">Giá tốt, vị trí đẹp, đánh giá cao</Paragraph>
        <Row gutter={[16, 16]}>
          {hotels.slice(0, 3).map((h) => (
            <Col xs={24} sm={12} md={12} lg={8} key={h.id}>
              <Link href={`/hotels/${h.id}`} style={{ display: 'block' }}>
                <Card
                  hoverable
                  cover={<img alt={h.name} src={h.image} style={{ height: 200, objectFit: 'cover' }} />}
                  title={h.name}
                  extra={<Tag color="blue">{h.category || 'Nổi bật'}</Tag>}
                  actions={[
                    <span key="price">
                      {h.price ? `${formatCurrency(h.price)}/đêm` : 'Liên hệ'}
                    </span>,
                  ]}
                >
                  <Space orientation="vertical" style={{ width: '100%' }}>
                    <Text strong>{h.location}</Text>
                  </Space>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      <div className="section">
        <Title level={3}>Tour đề xuất</Title>
        <Paragraph type="secondary">Chọn tour phù hợp, giá trọn gói rõ ràng</Paragraph>
        <Tabs
          items={[
            {
              key: 'tour',
              label: 'Tour hot',
              children: (
                <Row gutter={[16, 16]}>
                  {tours.slice(0, 3).map((t) => (
                    <Col xs={24} sm={12} md={12} lg={8} key={t.id}>
                      <Link href={`/tours/${t.id}`} style={{ display: 'block' }}>
                        <Card
                          hoverable
                          cover={<img alt={t.name} src={t.image} style={{ height: 200, objectFit: 'cover' }} />}
                          title={t.name}
                          extra={<Tag color="gold">{t.category || 'Tour hot'}</Tag>}
                          actions={[<span key="price">{formatCurrency(t.price || 0)}</span>]}
                        >
                          <Space orientation="vertical" style={{ width: '100%' }}>
                            <Text strong>{t.location}</Text>
                          </Space>
                        </Card>
                      </Link>
                    </Col>
                  ))}
                </Row>
              ),
            },
          ]}
        />
      </div>

      <div className="section">
        <Title level={3}>Vì sao nên chọn TravelEasy</Title>
        <Paragraph type="secondary">Nhanh, minh bạch và luôn sẵn sàng hỗ trợ bạn</Paragraph>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12} lg={8}>
            <Card className="highlight-card" variant="borderless" title="Giữ chỗ siêu nhanh" extra={<ThunderboltOutlined />}>
              <Paragraph>Giữ booking tạm thời với TTL, không lo mất phòng/tour trong lúc thanh toán.</Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8}>
            <Card className="highlight-card" variant="borderless" title="Thanh toán an toàn" extra={<SafetyOutlined />}>
              <Paragraph>Thanh toán online giả lập, kiểm thử luồng end-to-end trước khi go-live.</Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8}>
            <Card className="highlight-card" variant="borderless" title="Hỗ trợ 24/7" extra={<ClockCircleOutlined />}>
              <Paragraph>Đội ngũ luôn trực, xử lý yêu cầu hoàn hủy, thay đổi lịch trình kịp thời.</Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>Cẩm nang du lịch</Title>
            <Paragraph type="secondary" style={{ margin: 0 }}>Chia sẻ kinh nghiệm, bí kíp xê dịch hữu ích</Paragraph>
          </div>
          <Link href="/blogs">
            <Button type="link" icon={<ArrowRightOutlined />}>Xem tất cả</Button>
          </Link>
        </div>
        <Row gutter={[20, 20]}>
          {blogs.slice(0, 4).map((post) => (
            <Col xs={24} sm={12} lg={6} key={post.id}>
              <Link href={`/blogs/${post.id}`}>
                <Card
                  hoverable
                  style={{ borderRadius: 12, overflow: 'hidden', height: '100%', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                  styles={{ body: { padding: 16 } }}
                  cover={<img alt={post.title} src={post.images?.[0]} style={{ height: 160, objectFit: 'cover' }} />}
                >
                  <Title level={5} style={{ marginBottom: 8, height: 45, overflow: 'hidden', lineHeight: 1.4 }}>{post.title}</Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                  </Text>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>

      <div className="section">
        <Title level={3}>Quy trình đặt đơn giản</Title>
        <Steps
          titlePlacement="vertical"
          items={[
            { title: 'Tìm kiếm', content: 'Chọn điểm đến, ngày...' },
            { title: 'Đặt chỗ', content: 'Giữ chỗ/booking tạm thời' },
            { title: 'Thanh toán', content: 'Thanh toán giả lập/online' },
            { title: 'Xác nhận', content: 'Nhận email/push xác nhận' },
          ]}
        />
      </div>

      <div className="section cta-banner my-8 mx-4 md:mx-auto">
        <div className="cta-text mb-6">
          <Title level={3} className="text-xl md:text-2xl">Sẵn sàng cho chuyến đi tiếp theo?</Title>
          <Paragraph type="secondary" className="text-sm md:text-base">Khám phá hàng nghìn khách sạn và tour, đặt nhanh trong vài bước.</Paragraph>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/hotels" className="w-full sm:w-auto">
            <Button type="primary" size="large" className="w-full sm:w-auto h-12 text-base">
              Khám phá khách sạn
            </Button>
          </Link>
          <Link href="/tours" className="w-full sm:w-auto">
            <Button size="large" className="w-full sm:w-auto h-12 text-base">Xem tour hot</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
