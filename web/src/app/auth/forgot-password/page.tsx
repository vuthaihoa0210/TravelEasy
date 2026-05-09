'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const router = useRouter();

    const onFinishStep1 = async (values: { email: string }) => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            let data: any = {};
            try { data = await res.json(); } catch { /* server returned non-JSON */ }

            if (res.ok) {
                setEmail(values.email);
                setStep(2);
            } else {
                message.error(data.error || 'Có lỗi xảy ra, vui lòng thử lại sau');
            }
        } catch (error) {
            message.error('Lỗi kết nối đến máy chủ');
        } finally {
            setLoading(false);
        }
    };

    const onFinishStep2 = (values: { otp: string }) => {
        setOtpCode(values.otp);
        setStep(3);
    };

    const onFinishStep3 = async (values: { newPassword: string }) => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otpCode, newPassword: values.newPassword }),
            });

            let data: any = {};
            try { data = await res.json(); } catch { /* server returned non-JSON */ }

            if (res.ok) {
                message.success('Đặt lại mật khẩu thành công!');
                router.push('/auth/signin');
            } else {
                message.error(data.error || 'Có lỗi xảy ra, vui lòng thử lại sau');
            }
        } catch (error) {
            message.error('Lỗi kết nối đến máy chủ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '120px 20px 40px' // Tăng dãn cách phía trên so với Header
        }}>
            <Card
                className="auth-card"
                style={{
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Title level={2} style={{ marginBottom: 8 }}>Quên mật khẩu?</Title>
                    <Paragraph type="secondary">
                        {step === 1 
                            ? 'Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.' 
                            : step === 2 
                                ? 'Chúng tôi đã gửi mã xác nhận đến tài khoản gmail của bạn'
                                : 'Xác thực thành công. Hãy tạo một mật khẩu mới'}
                    </Paragraph>
                </div>

                {step === 1 && (
                    <Form layout="vertical" onFinish={onFinishStep1} autoComplete="off" size="large">
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="Email của bạn" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>
                                Tiếp tục
                            </Button>
                        </Form.Item>
                    </Form>
                )}

                {step === 2 && (
                    <Form layout="vertical" onFinish={onFinishStep2} autoComplete="off" size="large">
                        <div style={{ textAlign: 'center', marginBottom: 20, color: '#1677ff', background: '#e6f4ff', padding: 10, borderRadius: 8 }}>
                            Mã OTP của bạn là: <b>11222432</b>
                        </div>
                        <Form.Item
                            name="otp"
                            rules={[{ required: true, message: 'Vui lòng nhập mã OTP!' }]}
                        >
                            <Input placeholder="Nhập mã OTP (11222432)" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Xác nhận OTP
                            </Button>
                        </Form.Item>
                    </Form>
                )}

                {step === 3 && (
                    <Form layout="vertical" onFinish={onFinishStep3} autoComplete="off" size="large">
                        <Form.Item
                            name="newPassword"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                { min: 6, message: 'Mật khẩu phải từ 6 ký tự!' }
                            ]}
                        >
                            <Input.Password placeholder="Mật khẩu mới" />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Nhập lại mật khẩu mới" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>
                                Đặt lại mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>
                )}

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Link href="/auth/signin">
                        <Space>
                            <ArrowLeftOutlined />
                            <Text>Quay lại đăng nhập</Text>
                        </Space>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
