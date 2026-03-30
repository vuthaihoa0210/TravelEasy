'use client';

import { Card, Col, Row, Typography, Spin, Pagination, Tag } from 'antd';
import { CalendarOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const { Title, Paragraph, Text } = Typography;
const PAGE_SIZE = 9;

interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  images: string[];
  createdAt: string;
}

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const pagedBlogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return blogs.slice(start, start + PAGE_SIZE);
  }, [currentPage, blogs]);

  if (loading) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center' }}>
        <Spin size="large">
          <div style={{ marginTop: 45, color: '#1677ff', fontWeight: 500 }}>
            Đang tải các bài viết chia sẻ...
          </div>
        </Spin>
      </div>
    );
  }

  return (
    <div className="section" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ textAlign: 'center', marginBottom: 50 }}>
        <Title>Cẩm nang & Kinh nghiệm du lịch</Title>
        <Paragraph type="secondary" style={{ fontSize: 18 }}>
          Chia sẻ những hành trình thú vị, bí kíp săn vé và những điểm đến không thể bỏ qua
        </Paragraph>
      </header>

      <Row gutter={[24, 24]}>
        {pagedBlogs.map((post) => (
          <Col xs={24} sm={12} md={8} key={post.id}>
            <Card
              hoverable
              onClick={() => router.push(`/blogs/${post.id}`)}
              style={{ height: '100%', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              styles={{ body: { padding: 20, flex: 1, display: 'flex', flexDirection: 'column' } }}
              cover={
                <div style={{ height: 200, overflow: 'hidden' }}>
                  <img
                    alt={post.title}
                    src={post.images?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                    onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>
              }
            >
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 12 }}>
                  <Tag color="blue">Kinh nghiệm</Tag>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                  </Text>
                </div>
                <Title level={4} style={{ marginBottom: 12, lineHeight: 1.4, height: 55, overflow: 'hidden' }}>
                  {post.title}
                </Title>
                <Paragraph type="secondary" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 0 }}>
                  {post.content}
                </Paragraph>
              </div>
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  <UserOutlined style={{ marginRight: 4 }} /> {post.author}
                </Text>
                <Text style={{ color: '#1677ff', fontWeight: 600 }}>
                  Đọc thêm <ArrowRightOutlined style={{ fontSize: 11 }} />
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {blogs.length > PAGE_SIZE && (
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={blogs.length}
            onChange={page => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}
