'use client';

import { Col, Row, Tag, Select, Pagination, DatePicker, Spin } from 'antd';
import { useMemo, useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Star, ArrowRight, Plane, Calendar, Search } from 'lucide-react';
import dayjs from 'dayjs';

const PAGE_SIZE = 8;

interface Destination {
  id: string;
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

const removeAccents = (str: string) => {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
};

function FlightsContent() {
  const router = useRouter();
  const [flights, setFlights] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(null);
  const [sortBy, setSortBy] = useState<string | undefined>('price-asc');
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    fetch('/api/flights')
      .then(res => res.json())
      .then(data => {
        setFlights(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const searchParams = useSearchParams();
  
  useEffect(() => {
    const s = searchParams.get('search');
    if (s) setTo(s);
    else {
      setFrom('');
      setTo('');
    }
    setCurrentPage(1);
    setActiveTab('ALL');
    setSortBy('price-asc');
  }, [searchParams]);

  const filteredAndSortedFlights = useMemo(() => {
    let filtered = flights;
    if (activeTab !== 'ALL') {
      filtered = filtered.filter(f => f.category === activeTab);
    }

    if (from.trim()) {
      const fromLower = removeAccents(from);
      filtered = filtered.filter(f => {
        const n = removeAccents(f.name);
        const diIndex = n.indexOf(' di ');
        const dashIndex = n.indexOf(' - ');
        if (diIndex !== -1) return n.substring(0, diIndex).includes(fromLower);
        if (dashIndex !== -1) return n.substring(0, dashIndex).includes(fromLower);
        return n.includes(fromLower);
      });
    }
    
    if (to.trim()) {
      const toLower = removeAccents(to);
      filtered = filtered.filter(f => 
        (f.location && removeAccents(f.location).includes(toLower))
      );
    }

    if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return filtered;
  }, [flights, activeTab, from, to, sortBy]);

  const pagedFlights = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedFlights.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredAndSortedFlights]);

  const tabItems = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'DOMESTIC', label: 'Trong nước' },
    { key: 'INTERNATIONAL', label: 'Quốc tế' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-36 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Bay tới <span className="text-blue-600">tận cùng</span> thế giới</h1>
          <p className="text-base text-slate-500 max-w-xl font-light">
            Dịch vụ đặt vé máy bay đẳng cấp với hàng trăm hãng hàng không uy tín.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-10">
          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} sm={12} md={6}>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Từ</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="text"
                    placeholder="Khởi hành"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Đến</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="text"
                    placeholder="Điểm đến"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Ngày đi</label>
                <DatePicker
                  size="large"
                  placeholder="Chọn ngày"
                  className="w-full h-12 rounded-xl border-slate-200 bg-slate-50 hover:border-blue-500 transition-all"
                  value={date}
                  onChange={(value) => setDate(value as any)}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
               <button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95">
                 <Search className="w-4 h-4" /> Tìm chuyến
               </button>
            </Col>
          </Row>
        </div>

        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200">
           <div className="flex gap-8">
             {tabItems.map(tab => (
               <button 
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
                className={`cursor-pointer pb-4 text-[10px] font-bold tracking-widest uppercase transition-all relative ${
                  activeTab === tab.key ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
               >
                 {tab.label}
                 {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
               </button>
             ))}
           </div>
           
           <div className="pb-4 min-w-[200px]">
             <Select
                placeholder="Sắp xếp theo giá"
                style={{ width: '100%' }}
                variant="borderless"
                className="font-bold text-slate-600"
                value={sortBy}
                options={[
                  { label: 'Giá: Thấp đến cao', value: 'price-asc' },
                  { label: 'Giá: Cao đến thấp', value: 'price-desc' },
                ]}
                onChange={(value) => setSortBy(value)}
              />
           </div>
        </div>

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-6">
            <Spin size="large" />
            <div className="text-slate-400 font-medium tracking-widest uppercase text-[10px]">Đang liên kết với các hãng hàng không...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pagedFlights.map((f) => (
                <div 
                  key={f.id}
                  onClick={() => router.push(`/flights/${f.id}`)}
                  className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer flex flex-col sm:flex-row gap-5 relative overflow-hidden"
                >
                  <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden shrink-0">
                     <img src={f.image} alt={f.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-1.5">
                       <div className="flex items-center justify-between">
                          <Tag className="rounded-full bg-blue-50 text-blue-600 border-none font-bold text-[8px] px-2 uppercase tracking-tighter">
                            {f.category === 'INTERNATIONAL' ? 'Quốc tế' : 'Nội địa'}
                          </Tag>
                          <div className="flex items-center gap-1 text-slate-400 font-bold text-[9px]">
                            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /> {f.rating?.toFixed(1)}
                          </div>
                       </div>
                       <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight leading-snug">
                         {f.name}
                       </h3>
                       <p className="text-xs text-slate-500 font-light line-clamp-2 leading-relaxed">
                         {f.description}
                       </p>
                    </div>
                    
                    <div className="pt-3 flex items-center justify-between mt-auto">
                       <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Giá từ</span>
                          <span className="text-xl font-black text-blue-600 leading-none mt-1 tracking-tighter">{formatCurrency(f.price || 0)}</span>
                       </div>
                       <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px] group-hover:gap-2 transition-all">
                          Đặt chuyến <ArrowRight className="w-3.5 h-3.5" />
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAndSortedFlights.length > PAGE_SIZE && (
              <div className="mt-16 flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={PAGE_SIZE}
                  total={filteredAndSortedFlights.length}
                  onChange={(page) => { setCurrentPage(page); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                  showSizeChanger={false}
                  className="custom-pagination"
                />
              </div>
            )}
            
            {filteredAndSortedFlights.length === 0 && (
              <div className="py-40 text-center space-y-6 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                 <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                   <Plane className="w-10 h-10" />
                 </div>
                 <div className="space-y-2">
                   <h3 className="text-2xl font-bold text-slate-900">Không tìm thấy chuyến bay</h3>
                   <p className="text-slate-400 font-light max-w-sm mx-auto">Vui lòng thử tìm kiếm với các địa điểm hoặc thời gian khác.</p>
                 </div>
                 <button onClick={() => { setFrom(''); setTo(''); setActiveTab('ALL'); }} className="px-8 py-3 bg-blue-600 text-white rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">Tất cả chuyến bay</button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        .custom-pagination .ant-pagination-item {
          border-radius: 1rem;
          border: 1px solid #f1f5f9;
          font-weight: 700;
          background: white;
        }
        .custom-pagination .ant-pagination-item-active {
          background-color: #2563eb;
          border-color: #2563eb;
        }
        .custom-pagination .ant-pagination-item-active a {
          color: white !important;
        }
      `}</style>
    </div>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-slate-50"><Spin size="large" /></div>}>
      <FlightsContent />
    </Suspense>
  );
}