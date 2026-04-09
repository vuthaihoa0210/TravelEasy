'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, message, Row, Col, Steps } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SafetyCertificateOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { UserPlus, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [form] = Form.useForm();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [receivedOtp, setReceivedOtp] = useState('');

  // Step 1: Request OTP
  const onSendOtp = async (values: any) => {
    setLoading(true);
    const { email } = values;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      let data: any = {};
      try { data = await res.json(); } catch { /* server returned non-JSON */ }
      setLoading(false);

      if (res.ok) {
        setReceivedOtp(data.message || '');
        setUserEmail(email);
        setCurrentStep(1);
      } else {
        message.error(data.error || 'Có lỗi xảy ra khi gửi OTP.');
      }
    } catch (error) {
      setLoading(false);
      message.error('Không thể kết nối đến máy chủ.');
    }
  };

  // Step 2: Register with OTP
  const onRegister = async (values: any) => {
    setLoading(true);
    const allValues = form.getFieldsValue(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: allValues.name, 
          email: allValues.email, 
          password: allValues.password, 
          otp: values.otp 
        }),
      });

      let data: any = {};
      try { data = await res.json(); } catch { /* server returned non-JSON */ }
      setLoading(false);

      if (res.ok) {
        message.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
        router.push('/auth/signin');
      } else {
        message.error(data.error || 'Đăng ký thất bại.');
      }
    } catch (error) {
      setLoading(false);
      message.error('Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden pt-28">
      <Row className="w-full">
        {/* Left side: Premium Visual */}
        <Col xs={0} lg={12} className="relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-slate-900/90 mix-blend-multiply" />
          
          <div className="absolute inset-0 flex flex-col justify-center p-16 text-white space-y-8">
            <Link href="/" className="flex items-center gap-2 group w-fit">
               <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center group-hover:bg-white/40 transition-all">
                  <ArrowLeftOutlined className="text-white" />
               </div>
               <span className="font-bold tracking-tight">Về Trang Chủ</span>
            </Link>
            
            <div className="space-y-4 max-w-lg">
               <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none animate-fade-in">Mở cánh cửa<br/><span className="text-blue-400">trải nghiệm.</span></h1>
               <p className="text-lg text-white/70 font-light tracking-wide leading-relaxed animate-fade-in-up">
                 Gia nhập cộng đồng TravelEasy ngay hôm nay để nhận được những quyền lợi và ưu đãi chỉ dành riêng cho thành viên.
               </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 pt-12 animate-fade-in-up delay-200">
               {[
                 { icon: <ShieldCheck />, title: "Bảo mật", desc: "An toàn tuyệt đối" },
                 { icon: <Mail />, title: "Thông báo", desc: "Cập nhật ưu đãi sớm nhất" }
               ].map((item, i) => (
                 <div key={i} className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                       {item.icon}
                    </div>
                    <div>
                       <div className="font-bold text-sm tracking-tight">{item.title}</div>
                       <div className="text-white/50 text-xs">{item.desc}</div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </Col>

        {/* Right side: Modern Form */}
        <Col xs={24} lg={12} className="flex items-center justify-center p-8 md:p-16 bg-slate-50/50">
          <div className="w-full max-w-md space-y-10 animate-fade-in">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 rounded-[1.25rem] shadow-xl shadow-blue-500/20 flex items-center justify-center text-white">
                 <UserPlus className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tạo tài khoản mới</h2>
                <p className="text-slate-500 font-medium">Bắt đầu hành trình của bạn chỉ trong vài phút.</p>
              </div>
            </div>

            <Steps
              current={currentStep}
              items={[{ title: 'Thông tin' }, { title: 'Xác thực' }]}
              className="custom-steps"
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={currentStep === 0 ? onSendOtp : onRegister}
              size="large"
              className="space-y-4"
            >
              {currentStep === 0 && (
                <>
                  <div className="space-y-4">
                    <Form.Item name="name" rules={[{ required: true, message: 'Họ tên là bắt buộc' }]}>
                      <Input 
                        prefix={<UserOutlined className="text-slate-400" />} 
                        placeholder="Họ và Tên" 
                        className="h-14 rounded-2xl border-slate-200 bg-white"
                      />
                    </Form.Item>

                    <Form.Item 
                      name="email" 
                      rules={[
                        { required: true, message: 'Email là bắt buộc' },
                        { type: 'email', message: 'Email không hợp lệ' }
                      ]}
                    >
                      <Input 
                        prefix={<MailOutlined className="text-slate-400" />} 
                        placeholder="Địa chỉ Email" 
                        className="h-14 rounded-2xl border-slate-200 bg-white"
                      />
                    </Form.Item>

                    <Form.Item 
                      name="password" 
                      rules={[
                        { required: true, message: 'Mật khẩu là bắt buộc' },
                        { min: 6, message: 'Ít nhất 6 ký tự' }
                      ]}
                    >
                      <Input.Password 
                        prefix={<LockOutlined className="text-slate-400" />} 
                        placeholder="Mật khẩu bảo mật" 
                        className="h-14 rounded-2xl border-slate-200 bg-white"
                      />
                    </Form.Item>
                  </div>

                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    loading={loading} 
                    className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-lg shadow-blue-500/20"
                  >
                    Gửi mã xác nhận <ArrowRight className="inline ml-2 w-5 h-5" />
                  </Button>
                </>
              )}

              {currentStep === 1 && (
                <div className="space-y-8">
                   <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 space-y-2 text-center animate-fade-in-up">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Mã OTP đã được gửi đến</p>
                      <p className="text-xl font-black text-slate-900 tracking-tight">{userEmail}</p>
                      {receivedOtp && (
                        <div className="mt-4 p-3 bg-white rounded-xl border border-blue-200 font-mono text-2xl font-black text-blue-600 tracking-[0.2em] shadow-sm">
                           {receivedOtp}
                        </div>
                      )}
                   </div>

                   <Form.Item
                    name="otp"
                    rules={[
                      { required: true, message: 'Vui lòng nhập OTP' },
                      { len: 8, message: 'Mã phải có 8 chữ số' }
                    ]}
                  >
                    <Input 
                      prefix={<SafetyCertificateOutlined className="text-slate-400" />} 
                      placeholder="Mã số xác nhận" 
                      maxLength={8}
                      className="h-16 rounded-2xl border-slate-200 bg-white text-center text-2xl font-black tracking-[0.3em] font-mono"
                    />
                  </Form.Item>

                  <div className="space-y-4">
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      block 
                      loading={loading} 
                      className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-lg"
                    >
                      Xác nhận đăng ký
                    </Button>
                    <button 
                      type="button"
                      onClick={() => { setCurrentStep(0); setReceivedOtp(''); }}
                      className="w-full text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                    >
                      Quay lại chỉnh sửa
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-8 text-center">
                 <p className="text-slate-500 font-medium">Bạn đã có tài khoản?</p>
                 <Link href="/auth/signin" className="text-blue-600 font-black hover:underline tracking-tight text-lg">Đăng nhập ngay</Link>
              </div>
            </Form>
          </div>
        </Col>
      </Row>

      <style jsx global>{`
        .custom-steps .ant-steps-item-title {
          font-weight: 700 !important;
          color: #94a3b8 !important;
          text-transform: uppercase;
          font-size: 10px !important;
          letter-spacing: 0.1em;
        }
        .custom-steps .ant-steps-item-active .ant-steps-item-title {
          color: #2563eb !important;
        }
        .custom-steps .ant-steps-item-icon {
          border-radius: 8px !important;
        }
      `}</style>
    </div>
  );
}