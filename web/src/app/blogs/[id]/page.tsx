'use client';

import { use, useEffect, useState } from 'react';
import { Typography, Spin, Card, Image, Breadcrumb, Divider, Row, Col, Space, Button, List } from 'antd';
import { CalendarOutlined, UserOutlined, ArrowLeftOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Paragraph, Text } = Typography;

export default function BlogDetailPage({ params }: { params: any }) {
  const router = useRouter();
  const { id } = use(params) as { id: string };
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);

    // Fetch blog detail
    fetch(`/api/blogs/${id}`)
      .then(res => res.json())
      .then(data => {
        setBlog(data);
        setLoading(false);
      });

    // Fetch recent blogs for sidebar
    fetch(`/api/blogs`)
      .then(res => res.json())
      .then(data => {
        setRecentBlogs(data.slice(0, 5));
      });
  }, [id]);

  if (loading) return (
    <div style={{ padding: 100, textAlign: 'center' }}>
      <Spin size="large">
        <div style={{ marginTop: 45 }}>Đang tải bài viết...</div>
      </Spin>
    </div>
  );

  if (!blog) return (
    <div style={{ padding: 100, textAlign: 'center' }}>
      <Title level={4}>Không tìm thấy bài viết</Title>
      <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/blogs')}>Quay lại danh sách</Button>
    </div>
  );

  return (
    <div className="section" style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <Breadcrumb style={{ marginBottom: 24 }} items={[
          { title: <a onClick={() => router.push('/')}>Trang chủ</a> },
          { title: <a onClick={() => router.push('/blogs')}>Blogs</a> },
          { title: blog.title }
        ]} />

        <Row gutter={32}>
          <Col xs={24} lg={16}>
            <Card style={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} styles={{ body: { padding: 40 } }}>
              <Space orientation="vertical" size="large" style={{ width: '100%' }}>
                <header>
                  <Title level={1}>{blog.title}</Title>
                  <Space separator={<Divider orientation="vertical" />} style={{ color: '#8c8c8c' }}>
                    <span><CalendarOutlined style={{ marginRight: 4 }} /> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span><UserOutlined style={{ marginRight: 4 }} /> {blog.author}</span>
                  </Space>
                </header>

                <div style={{ borderRadius: 12, overflow: 'hidden', height: 450 }}>
                   <Image
                    src={blog.images?.[0] || 'https://via.placeholder.com/800x450'}
                    alt={blog.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <Paragraph style={{ fontSize: 18, lineHeight: 1.8, whiteSpace: 'pre-wrap', color: '#334155' }}>
                  {blog.content}
                </Paragraph>

                {blog.images && blog.images.length > 1 && (
                  <div style={{ marginTop: 40 }}>
                    <Title level={3}>Hình ảnh chia sẻ</Title>
                    <Row gutter={[16, 16]}>
                      {blog.images.slice(1).map((img: string, idx: number) => (
                        <Col xs={24} sm={12} key={idx}>
                          <Image
                            src={img}
                            alt={`img-${idx}`}
                            style={{ width: '100%', borderRadius: 8, height: 250, objectFit: 'cover' }}
                          />
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                <Divider />
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/blogs')}>
                    Tất cả bài viết
                  </Button>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Bài viết mới nhất" style={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {recentBlogs.map((item, idx) => (
                  <div 
                    key={item.id}
                    onClick={() => router.push(`/blogs/${item.id}`)}
                    style={{ 
                      padding: '16px 0', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      gap: 12,
                      borderBottom: idx === recentBlogs.length - 1 ? 'none' : '1px solid #f0f0f0' 
                    }}
                  >
                    <img src={item.images?.[0]} style={{ width: 64, height: 60, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} alt={item.title} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <Text strong style={{ fontSize: 14, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.title}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</Text>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card style={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', background: 'linear-gradient(135deg,#1677ff,#0958d9)', color: '#fff' }}>
              <Title level={4} style={{ color: '#fff' }}>Hỗ trợ đặt tour?</Title>
              <Paragraph style={{ color: '#e6f4ff' }}>Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 để có một chuyến đi tuyệt vời nhất.</Paragraph>
              <Button 
                ghost 
                block 
                size="large" 
                style={{ borderRadius: 8 }}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open_chatbot', { detail: { mode: 'live' } }));
                }}
              >
                Liên hệ ngay
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
