'use client';

import { signIn } from 'next-auth/react';
import { useState, Suspense } from 'react';
import { Form, Input, Button, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LogIn, KeyRound, ArrowRight } from 'lucide-react';

function SignInContent() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const onFinish = async (values: any) => {
    setLoading(true);
    const { email, password } = values;
    
    const res = await signIn('credentials', { 
      email, 
      password, 
      redirect: false 
    });

    setLoading(false);
    if (res?.error) {
      message.error('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
    } else {
      message.success('Đăng nhập thành công!');
      window.location.href = callbackUrl;
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden pt-28">
      <Row className="w-full">
        {/* Left Visual Section */}
        <Col xs={0} lg={12} className="relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&q=80)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-slate-900/90 mix-blend-multiply" />
          
          <div className="absolute inset-0 flex flex-col justify-center p-20 text-white space-y-8">
            <Link href="/" className="flex items-center gap-2 group w-fit">
               <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all border border-white/10">
                  <ArrowLeftOutlined className="text-white" />
               </div>
               <span className="font-bold tracking-tight">Trở về Trang Chủ</span>
            </Link>
            
            <div className="space-y-4 max-w-lg">
               <h1 className="text-6xl font-black tracking-tighter leading-[0.9] animate-fade-in text-white/95">Chào mừng<br/>quay lại.</h1>
               <p className="text-xl text-white/60 font-light tracking-wide leading-relaxed animate-fade-in-up">
                 Đăng nhập để tiếp tục hành trình khám phá và quản lý những chuyến du lịch tuyệt vời nhất của bạn.
               </p>
            </div>
            
            <div className="pt-12 animate-fade-in-up delay-200">
               <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900/50 overflow-hidden shadow-xl">
                       <img src={`https://i.pravatar.cc/150?img=${i+10}`} alt="User" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full bg-blue-600 border-4 border-slate-900/50 flex items-center justify-center text-[10px] font-bold text-white shadow-xl">
                     +10k
                  </div>
               </div>
               <p className="mt-4 text-xs font-bold text-white/40 uppercase tracking-widest">Gia nhập cùng hơn 10,000 du khách</p>
            </div>
          </div>
        </Col>

        {/* Right Form Section */}
        <Col xs={24} lg={12} className="flex items-center justify-center p-8 md:p-20 bg-slate-50/30">
          <div className="w-full max-w-md space-y-12 animate-fade-in">
            <div className="space-y-4 text-center lg:text-left">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl shadow-2xl shadow-blue-500/30 flex items-center justify-center text-white mx-auto lg:mx-0">
                 <LogIn className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Đăng nhập tài khoản</h2>
                <p className="text-slate-500 font-medium">Truy cập để quản lý các dịch vụ du lịch của bạn.</p>
              </div>
            </div>

            <Form
              name="login"
              layout="vertical"
              onFinish={onFinish}
              size="large"
              className="space-y-6"
            >
              <div className="space-y-4">
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Nhập email để tiếp tục' },
                    { type: 'email', message: 'Email không hợp lệ' }
                  ]}
                  className="m-0"
                >
                  <Input 
                    prefix={<UserOutlined className="text-slate-400" />} 
                    placeholder="Địa chỉ Email" 
                    className="h-16 rounded-2xl border-slate-200 bg-white shadow-sm"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Nhập mật khẩu của bạn' }]}
                  className="m-0"
                >
                  <Input.Password 
                    prefix={<LockOutlined className="text-slate-400" />} 
                    placeholder="Mật khẩu bảo mật" 
                    className="h-16 rounded-2xl border-slate-200 bg-white shadow-sm"
                  />
                </Form.Item>
              </div>

              <div className="flex justify-end">
                <Link href="/auth/forgot-password" className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.1em]">
                  Quên mật khẩu?
                </Link>
              </div>

              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                loading={loading} 
                className="h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black text-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 border-none"
              >
                Đăng nhập ngay <ArrowRight className="w-6 h-6" />
              </Button>

              <div className="pt-10 text-center border-t border-slate-100">
                <p className="text-slate-400 font-medium mb-1">Bạn chưa có tài khoản?</p>
                <Link href="/auth/register" className="text-blue-600 font-black text-lg tracking-tight hover:underline">Tạo một tài khoản mới</Link>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white pt-28"><div className="text-slate-400">Đang tải...</div></div>}>
      <SignInContent />
    </Suspense>
  );
}