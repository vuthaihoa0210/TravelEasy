'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Button, Typography, message, Spin } from 'antd';
import {
  DesktopOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  ShoppingOutlined,
  GlobalOutlined,
  HomeOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/');
      message.error('Bạn không có quyền truy cập trang quản trị');
    }
  }, [status, session, router]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  if (status === 'loading' || (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN')) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <Spin size="large" tip="Đang kiểm tra quyền truy cập...">
          <div style={{ height: 50 }} />
        </Spin>
      </div>
    );
  }

  const items = [
    { key: '/admin/bookings', icon: <ShoppingOutlined />, label: <Link href="/admin/bookings">Đơn đặt hàng</Link> },
    { key: '/admin/tours', icon: <GlobalOutlined />, label: <Link href="/admin/tours">Quản lý Tour</Link> },
    { key: '/admin/hotels', icon: <HomeOutlined />, label: <Link href="/admin/hotels">Quản lý Khách sạn</Link> },
    { key: '/admin/flights', icon: <UserOutlined />, label: <Link href="/admin/flights">Quản lý Chuyến bay</Link> },
    { key: '/admin/blogs', icon: <FileOutlined />, label: <Link href="/admin/blogs">Bài viết - Tin tức</Link> },
    { key: '/admin/chat', icon: <MessageOutlined />, label: <Link href="/admin/chat">Hỗ trợ Chat</Link> },
    { key: '/', icon: <DesktopOutlined />, label: <Link href="/">Về Trang Khách</Link> }
  ];

  // Map current pathname to menu key
  const selectedKey = items.map(item => item.key).find(key => pathname.startsWith(key)) || '/admin/bookings';

  return (
    <Layout style={{ minHeight: '100vh', paddingTop: 105 }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} theme="light">
        <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.05)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <Typography.Text strong style={{ opacity: collapsed ? 0 : 1, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}>TravelEasy Admin</Typography.Text>
        </div>
        <Menu theme="light" defaultSelectedKeys={[selectedKey]} selectedKeys={[selectedKey]} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              marginTop: 16
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          TravelEasy Admin Panel ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
}
