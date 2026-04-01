'use client';

import { Card, Col, Row, Typography, Spin, Pagination, Tag } from 'antd';
import { CalendarOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const { Title, Paragraph, Text } = Typography;
const PAGE_SIZE = 8;

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
        setBlogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setBlogs([]);
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
    <div className="section" style={{ maxWidth: 1200, margin: '0 auto', padding: '140px 20px 80px' }}>
      <header style={{ textAlign: 'center', marginBottom: 50 }}>
        <Title>Cẩm nang & Kinh nghiệm du lịch</Title>
        <Paragraph type="secondary" style={{ fontSize: 18 }}>
          Chia sẻ những hành trình thú vị, bí kíp săn vé và những điểm đến không thể bỏ qua
        </Paragraph>
      </header>

      <Row gutter={[20, 20]}>
        {pagedBlogs.map((post) => (
          <Col xs={24} sm={12} lg={6} key={post.id}>
            <Card
              hoverable
              onClick={() => router.push(`/blogs/${post.id}`)}
              className="group border-none shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden rounded-2xl flex flex-col bg-white"
              styles={{ body: { padding: 20, flex: 1, display: 'flex', flexDirection: 'column' } }}
              cover={
                <div className="relative h-48 overflow-hidden">
                  <img
                    alt={post.title}
                    src={post.images?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                     <Tag className="m-0 border-none bg-blue-600 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20">Bài viết</Tag>
                  </div>
                </div>
              }
            >
              <div className="flex-1 space-y-3">
                 <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <CalendarOutlined className="text-blue-500" />
                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                 </div>
                 
                 <h3 className="text-[17px] font-bold text-slate-900 leading-snug line-clamp-2 h-12 group-hover:text-blue-600 transition-colors">
                   {post.title}
                 </h3>
                 
                 <p className="text-[13px] text-slate-400 leading-relaxed line-clamp-2 font-light">
                   {post.content}
                 </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                     {post.author?.[0] || 'A'}
                   </div>
                   <Text type="secondary" className="text-[11px] font-medium">{post.author}</Text>
                </div>
                <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[11px] uppercase tracking-wider group-hover:gap-2.5 transition-all">
                  Xem chi tiết <ArrowRightOutlined />
                </div>
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
