'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Typography, Spin, Tag, Empty, Divider, Layout, message, Space } from 'antd';
import { PercentageOutlined, DollarOutlined, CalendarOutlined, RocketOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

interface Voucher {
    id: number;
    code: string;
    type: string;
    value: number;
    minOrderValue: number;
    maxDiscount: number | null;
    startDate: string;
    endDate: string;
    category: string;
}

export default function VouchersPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // We fetch public available vouchers. 
        // In a real app, you might fetch specifically what the user 'owns'.
        fetch('/api/vouchers/available')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setVouchers(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching vouchers:", err);
                setLoading(false);
            });
    }, []);

    const handleUseNow = (category: string) => {
        switch (category) {
            case 'HOTEL':
                router.push('/hotels');
                break;
            case 'FLIGHT':
                router.push('/flights');
                break;
            case 'TOUR':
                router.push('/tours');
                break;
            default:
                router.push('/#featured-services');
                break;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px' }}>
                <Spin size="large" tip="Đang tải ưu đãi...">
                    <div style={{ height: 50 }} />
                </Spin>
            </div>
        );
    }

<div />

    return (
        <Content style={{ padding: '160px 20px 80px', maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <Title level={2}>Kho Ưu Đãi Của Bạn</Title>
                <Paragraph type="secondary">Khám phá các mã giảm giá hấp dẫn dành riêng cho bạn</Paragraph>
            </div>

            {vouchers.length === 0 ? (
                <Empty description="Hiện chưa có ưu đãi nào dành cho bạn" />
            ) : (
                <Row gutter={[24, 24]}>
                    {vouchers.map((v) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={v.id}>
                            <Card
                                hoverable
                                style={{
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                    border: '1px solid #f0f0f0',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                                styles={{ body: { padding: 20, flex: 1, display: 'flex', flexDirection: 'column' } }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div style={{
                                        background: '#fff7e6',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {v.type === 'PERCENT' ?
                                            <PercentageOutlined style={{ fontSize: 24, color: '#fa8c16' }} /> :
                                            <DollarOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
                                        }
                                    </div>
                                    <Tag color={
                                        v.category === 'HOTEL' ? 'blue' :
                                            v.category === 'FLIGHT' ? 'green' :
                                                v.category === 'TOUR' ? 'gold' : 'magenta'
                                    }>
                                        {v.category === 'HOTEL' ? 'Khách sạn' :
                                            v.category === 'FLIGHT' ? 'Chuyến bay' :
                                                v.category === 'TOUR' ? 'Tour' : 'Tất cả dịch vụ'}
                                    </Tag>
                                </div>

                                <Title level={4} style={{ margin: '0 0 8px 0' }}>{v.code}</Title>
                                <Text strong style={{ fontSize: 18, color: '#ff4d4f', display: 'block', marginBottom: 8 }}>
                                    Giảm {v.type === 'PERCENT' ? `${v.value}%` : formatCurrency(v.value)}
                                </Text>

                                <div style={{ flex: 1 }}>
                                    <div style={{ marginBottom: 4 }}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>Đơn tối thiểu: </Text>
                                        <Text style={{ fontSize: 12 }}>{formatCurrency(v.minOrderValue)}</Text>
                                    </div>
                                    {v.maxDiscount && (
                                        <div style={{ marginBottom: 4 }}>
                                            <Text type="secondary" style={{ fontSize: 12 }}>Giảm tối đa: </Text>
                                            <Text style={{ fontSize: 12 }}>{formatCurrency(v.maxDiscount)}</Text>
                                        </div>
                                    )}
                                    <Divider style={{ margin: '12px 0' }} />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <CalendarOutlined style={{ color: '#8c8c8c' }} />
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            HSD: {dayjs(v.endDate).format('DD/MM/YYYY')}
                                        </Text>
                                    </div>
                                </div>

                                <Button
                                    type="primary"
                                    block
                                    icon={<RocketOutlined />}
                                    style={{ marginTop: 20, borderRadius: 8, height: 40 }}
                                    onClick={() => handleUseNow(v.category)}
                                >
                                    Dùng ngay
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Content>
    );
}
