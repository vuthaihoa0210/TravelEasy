'use client';

import { Button, Col, Input, Row, Space, Statistic, Steps, Tabs, Tag, Typography, Spin } from 'antd';
import { CompassOutlined, SearchOutlined, ThunderboltOutlined, SafetyOutlined, ClockCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, Hotel, Map, Star, ShieldCheck, Zap, Headset, Calendar, ChevronRight, MapPin } from 'lucide-react';

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
    subtitle: 'Hành trình vạn dặm, bắt đầu từ một cái chạm.',
  },
  {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80',
    title: 'Khách sạn cao cấp & sang trọng',
    subtitle: 'Hơn 1.200 điểm dừng chân đẳng cấp đang chờ bạn.',
  },
  {
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80',
    title: 'Cất cánh tới thiên đường',
    subtitle: 'Tìm kiếm chuyến bay tốt nhất với mức giá cạnh tranh nhất.',
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
      setHotels(Array.isArray(hotelsData) ? hotelsData : []);
      setTours(Array.isArray(toursData) ? toursData : []);
      setBlogs(Array.isArray(blogsData) ? blogsData : []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-50"><Spin size="large" /></div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ── HERO SECTION ── */}
      <section className="relative h-[75vh] min-h-[500px] overflow-hidden bg-slate-900">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[1200ms] ease-in-out ${
              idx === currentSlide ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}

        {/* Sophisticated Overlay */}
        <div className="absolute inset-0 z-10 bg-black/40" />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
          <div className="max-w-4xl space-y-1 animate-fade-in">
            <span className="text-lg md:text-xl font-light tracking-[0.3em] uppercase text-white/80 block mb-1">
               Tour du lịch hot
            </span>
            <h1 className="text-5xl md:text-8xl font-script leading-tight drop-shadow-2xl text-white">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xs md:text-sm text-white/60 font-light tracking-[0.2em] uppercase pt-3">
              {slides[currentSlide].subtitle}
            </p>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white transition-all group"
        >
          <ChevronRight className="w-8 h-8 rotate-180 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white transition-all group"
        >
          <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Hero Indicators (refined) */}
        <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center gap-4">
          {slides.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === currentSlide ? 'w-10 bg-amber-500' : 'w-4 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── SEARCH CARD (Floating) ── */}
      <section className="relative z-40 max-w-4xl mx-auto -mt-12 px-4 font-sans">
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-8 border border-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <CompassOutlined className="text-blue-600" /> Tìm cảm hứng cho chuyến đi
            </h2>
            <div className="hidden sm:flex items-center gap-6">
               <Statistic title="Điểm đến" value={1200} styles={{ title: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }, content: { fontSize: 18, color: '#1e293b' } }} />
               <Statistic title="Đánh giá 5★" value={4800} styles={{ title: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }, content: { fontSize: 18, color: '#1e293b' } }} />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Map className="w-4 h-4" />
              </div>
              <input 
                type="text"
                placeholder="Bạn muốn đi đâu? (Đà Nẵng, Phú Quốc...)"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                value={searchDest}
                onChange={(e) => setSearchDest(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && router.push(`/hotels?search=${encodeURIComponent(searchDest)}`)}
              />
            </div>
            <button 
              onClick={() => router.push(`/hotels?search=${encodeURIComponent(searchDest)}`)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <SearchOutlined /> Tìm ngay
            </button>
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS SECTION ── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              Khách sạn <span className="text-blue-600 italic">đẳng cấp</span>
            </h2>
            <p className="text-sm text-slate-400 font-light max-w-lg">
              Tuyển chọn những không gian lưu trú tinh tế và sang trọng nhất.
            </p>
          </div>
          <Link href="/hotels" className="group flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all whitespace-nowrap">
             Xem tất cả danh mục <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hotels.slice(0, 3).map((h) => (
            <Link href={`/hotels/${h.id}`} key={h.id} className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1.5 border border-slate-100">
               <div className="relative h-56 overflow-hidden">
                 <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute top-3 left-3">
                   <Tag color="blue" className="rounded-full px-2 py-0.5 bg-white/90 backdrop-blur text-blue-600 border-none font-bold uppercase text-[7px] tracking-widest">{h.category || 'Nổi bật'}</Tag>
                 </div>
                 <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur rounded-lg px-2 py-0.5 flex items-center gap-1 shadow-sm">
                   <Star className="w-2 h-2 text-amber-500 fill-amber-500" />
                   <span className="text-[9px] font-bold text-slate-800">4.9</span>
                 </div>
               </div>
               <div className="p-4 space-y-1.5">
                 <div className="flex items-center gap-1 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                   <MapPin className="w-2.5 h-2.5" /> {h.location}
                 </div>
                 <h3 className="text-base font-bold text-slate-900 line-clamp-1 tracking-tight group-hover:text-blue-600 transition-colors">{h.name}</h3>
                 <div className="pt-2.5 border-t border-slate-50 flex items-center justify-between">
                   <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Giá từ</div>
                   <div className="text-base font-black text-blue-600">{h.price ? `${formatCurrency(h.price)}` : 'Liên hệ'}</div>
                 </div>
               </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED TOURS SECTION ── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              Tour du lịch <span className="text-blue-600 italic">đặc sắc</span>
            </h2>
            <p className="text-sm text-slate-400 font-light max-w-lg">
              Hành trình trải nghiệm vạn vật với lịch trình tối ưu nhất.
            </p>
          </div>
          <Link href="/tours" className="group flex items-center gap-2 text-slate-400 font-bold text-xs hover:text-blue-600 transition-all uppercase tracking-widest">
             Khám phá thêm <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {tours.slice(0, 4).map((t) => (
            <Link href={`/tours/${t.id}`} key={t.id} className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1.5 border border-slate-100">
               <div className="relative h-48 overflow-hidden">
                 <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute top-2.5 left-2.5">
                   <Tag color="black" className="rounded-full px-2 py-0.5 bg-black/80 backdrop-blur text-white border-none font-bold uppercase text-[7px] tracking-widest">Tour Hot</Tag>
                 </div>
               </div>
               <div className="p-4 space-y-1.5">
                 <div className="flex items-center gap-1 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                   <Calendar className="w-2.5 h-2.5" /> 3 ngày 2 đêm
                 </div>
                 <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight tracking-tight group-hover:text-blue-600 transition-colors h-10">{t.name}</h3>
                 <div className="pt-2 flex items-center justify-between border-t border-slate-50 mt-1">
                   <div className="text-[9px] font-black text-blue-600">{formatCurrency(t.price || 0)}</div>
                   <div className="text-[9px] font-bold text-slate-300">/khách</div>
                 </div>
               </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── WHY US SECTION ── */}
      <section className="bg-slate-100/50 py-16 overflow-hidden border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center space-y-3 mb-12">
             <h2 className="text-2xl md:text-2xl font-bold tracking-tight text-slate-900 uppercase tracking-[0.2em]">Tại sao nên chọn TravelEasy?</h2>
             <p className="text-slate-400 text-xs font-light max-w-xl mx-auto">Kiến tạo hành trình tinh tế, minh bạch và tận tâm tuyệt đối.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             {[
               { icon: <Zap className="w-7 h-7" />, title: "Tốc độ", desc: "Giữ chỗ và xác nhận hành trình chỉ trong vài giây." },
               { icon: <ShieldCheck className="w-7 h-7" />, title: "Bảo mật", desc: "Mọi giao dịch đều được mã hóa và bảo mật đa lớp." },
               { icon: <Headset className="w-7 h-7" />, title: "Tận tâm", desc: "Đội ngũ hỗ trợ chuyên biệt luôn sẵn sàng phục vụ 24/7." },
             ].map((item, idx) => (
               <div key={idx} className="group text-center space-y-6">
                 <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-blue-500/5 flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                   <div className="text-blue-600 group-hover:text-white transition-colors">{item.icon}</div>
                 </div>
                 <h3 className="text-base font-bold text-slate-800 uppercase tracking-widest">{item.title}</h3>
                 <p className="text-slate-500 text-xs leading-relaxed font-light px-4">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING GUIDE SECTION ── */}
      <section id="booking-guide" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center space-y-3 mb-12">
              <h2 className="text-2xl md:text-2xl font-bold tracking-tight text-slate-900 uppercase tracking-[0.1em]">Quy trình đặt</h2>
              <p className="text-slate-400 text-xs font-light max-w-xl mx-auto">4 bước nhanh chóng để khám phá thế giới.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-slate-100 -z-0" />
              
              {[
                { step: "01", title: "Tìm kiếm", desc: "Nhập điểm đến và thời gian mong muốn của bạn." },
                { step: "02", title: "Lựa chọn", desc: "So sánh và chọn dịch vụ phù hợp với ngân sách." },
                { step: "03", title: "Thanh toán", desc: "Thủ tục thanh toán an toàn, bảo mật tuyệt đối." },
                { step: "04", title: "Xác nhận", desc: "Nhận thông tin đặt chỗ và sẵn sàng khởi hành." },
              ].map((item, idx) => (
                <div key={idx} className="relative z-10 text-center space-y-6 group">
                   <div className="w-12 h-12 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center mx-auto text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-500">
                      {item.step}
                   </div>
                   <h3 className="text-base font-bold text-slate-800 uppercase tracking-widest">{item.title}</h3>
                   <p className="text-slate-500 text-xs leading-relaxed font-light">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* ── BLOGS SECTION ── */}
      <section id="blogs-section" className="py-24 max-w-7xl mx-auto px-6 scroll-mt-24">
        <div className="flex items-center justify-between mb-12">
           <h2 className="text-3xl md:text-3xl font-bold text-slate-800 tracking-tight uppercase tracking-[0.1em]">Cẩm nang du lịch</h2>
           <Link href="/blogs" className="text-blue-600 font-bold hover:underline text-sm uppercase tracking-widest">Xem thêm</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {blogs.slice(0, 4).map((post) => (
             <Link href={`/blogs/${post.id}`} key={post.id} className="group">
               <div className="relative h-48 rounded-2xl overflow-hidden mb-4 shadow-lg">
                 <img src={post.images?.[0]} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">{post.title}</h3>
               <div className="mt-2 text-slate-400 text-xs font-medium">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</div>
             </Link>
           ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto bg-blue-600 rounded-[2rem] p-10 md:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl shadow-blue-500/20">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight relative z-10">Sẵn sàng khởi hành?</h2>
          <p className="text-base text-white/80 font-light max-w-lg mx-auto relative z-10">Gia nhập cộng đồng TravelEasy và khám phá những hành trình tuyệt vời nhất.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10 pt-2">
            <button 
              onClick={() => router.push('/auth/register')}
              className="px-8 py-3 bg-white text-blue-600 rounded-full font-bold text-sm hover:shadow-lg transition-all"
            >
              Đăng ký ngay
            </button>
            <button 
              onClick={() => router.push('/tours')}
              className="px-8 py-3 bg-black/10 text-white rounded-full font-bold text-sm hover:bg-black/20 border border-white/20 transition-all"
            >
              Xem tour du lịch
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
