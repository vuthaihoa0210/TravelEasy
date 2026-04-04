'use client';

import { Col, Row, Tag, Select, Pagination, Slider, Spin } from 'antd';
import { useMemo, useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Star, ArrowRight, Search, Hotel } from 'lucide-react';

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

function HotelsContent() {
  const router = useRouter();
  const [hotels, setHotels] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string | undefined>('price-asc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000000]);

  useEffect(() => {
    fetch('/api/hotels')
      .then(res => res.json())
      .then(data => {
        setHotels(data);
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
    if (s) setSearchTerm(s);
    else setSearchTerm('');
    
    setCurrentPage(1);
    setActiveTab('ALL');
    setSortBy('price-asc');
  }, [searchParams]);

  const filteredAndSortedHotels = useMemo(() => {
    let filtered = hotels;
    if (activeTab !== 'ALL') {
      filtered = filtered.filter(h => h.category === activeTab);
    }
    
    if (searchTerm.trim()) {
      const term = removeAccents(searchTerm);
      filtered = filtered.filter(h => 
        (h.location && removeAccents(h.location).includes(term)) ||
        removeAccents(h.name).includes(term)
      );
    }

    filtered = filtered.filter(h => (h.price || 0) >= priceRange[0] && (h.price || 0) <= priceRange[1]);

    if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return filtered;
  }, [hotels, activeTab, searchTerm, sortBy, priceRange]);

  const pagedHotels = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedHotels.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredAndSortedHotels]);

  const tabItems = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'DOMESTIC', label: 'Trong nước' },
    { key: 'INTERNATIONAL', label: 'Quốc tế' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-36 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-8 space-y-2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Điểm dừng chân <span className="text-blue-600">hoàn mỹ</span></h1>
          <p className="text-base text-slate-500 max-w-xl font-light">
            Từ những khu nghỉ dưỡng biệt lập đến các khách sạn sang trọng bậc nhất.
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-10">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} lg={10}>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <input 
                  type="text"
                  placeholder="Tìm khách sạn hoặc thành phố..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-700 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={7}>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                  <span>Giá mỗi đêm</span>
                  <span className="text-blue-600 lowercase font-medium">{formatCurrency(priceRange[1])}</span>
                </div>
                <Slider
                  range
                  min={0}
                  max={20000000}
                  step={500000}
                  value={priceRange}
                  onChange={(v) => { setPriceRange(v as [number,number]); setCurrentPage(1); }}
                  tooltip={{ formatter: (v) => formatCurrency(v || 0) }}
                  className="mx-2"
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={7}>
               <Select
                size="large"
                placeholder="Phân loại"
                style={{ width: '100%' }}
                className="h-14 custom-select"
                variant="filled"
                value={sortBy}
                options={[
                  { label: 'Giá: Thấp đến cao', value: 'price-asc' },
                  { label: 'Giá: Cao đến thấp', value: 'price-desc' },
                ]}
                onChange={(value) => setSortBy(value)}
              />
            </Col>
          </Row>
        </div>

        <div className="mb-8 border-b border-slate-200">
           <div className="flex gap-8 overflow-x-auto pb-px">
             {tabItems.map(tab => (
               <button 
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
                className={`cursor-pointer pb-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all relative whitespace-nowrap ${
                  activeTab === tab.key ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
               >
                 {tab.label}
                 {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
               </button>
             ))}
           </div>
        </div>

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-6">
            <Spin size="large" />
            <div className="text-slate-400 font-medium tracking-widest uppercase text-[10px]">Đang gợi ý những không gian tuyệt vời nhất...</div>
          </div>
        ) : (
          <>
            <Row gutter={[32, 40]}>
              {pagedHotels.map((h) => (
                <Col xs={24} sm={12} md={8} lg={6} key={h.id}>
                  <div 
                    onClick={() => router.push(`/hotels/${h.id}`)}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-700 cursor-pointer flex flex-col h-full hover:-translate-y-2"
                  >
                    <div className="relative h-52 overflow-hidden">
                       <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                       <div className="absolute top-4 left-4">
                         <div className="px-2 py-0.5 bg-white/90 backdrop-blur-md text-blue-600 rounded-full font-bold uppercase text-[8px] tracking-widest shadow-lg">
                           {h.category === 'INTERNATIONAL' ? 'Quốc tế' : 'Trong nước'}
                         </div>
                       </div>
                       <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-[9px] font-bold">
                             <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /> {h.rating?.toFixed(1) || "5.0"}
                          </div>
                       </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1 space-y-3">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em]">
                        <MapPin className="w-2.5 h-2.5" /> {h.location}
                      </div>
                      
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug tracking-tight">
                        {h.name}
                      </h3>
                      
                      <p className="text-xs text-slate-500 font-light line-clamp-2 leading-relaxed flex-1">
                        {h.description}
                      </p>
                      
                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex flex-col">
                           <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Khởi điểm từ</span>
                           <span className="text-lg font-black text-slate-900 leading-none mt-1 tracking-tighter">{formatCurrency(h.price || 0)}<span className="text-[10px] font-medium text-slate-400 ml-1">/đêm</span></span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 flex items-center justify-center group-hover:scale-105">
                           <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            {filteredAndSortedHotels.length > PAGE_SIZE && (
              <div className="mt-20 flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={PAGE_SIZE}
                  total={filteredAndSortedHotels.length}
                  onChange={(page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  showSizeChanger={false}
                  className="custom-pagination"
                />
              </div>
            )}
            
            {filteredAndSortedHotels.length === 0 && (
              <div className="py-40 text-center space-y-6 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                 <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                   <Hotel className="w-10 h-10" />
                 </div>
                 <div className="space-y-2">
                   <h3 className="text-2xl font-bold text-slate-900">Không tìm thấy khách sạn</h3>
                   <p className="text-slate-400 font-light max-w-sm mx-auto">Vui lòng điều chỉnh lại bộ lọc hoặc tìm kiếm theo một tên thành phố khác.</p>
                 </div>
                 <button onClick={() => { setSearchTerm(''); setActiveTab('ALL'); setPriceRange([0, 20000000]); }} className="px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-blue-600 transition-colors">Thiết lập lại bộ lọc</button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Custom Styles */}
      <style jsx global>{`
        .custom-select .ant-select-selector {
          border-radius: 1.25rem !important;
          background-color: #f8fafc !important;
          border: 1px solid #f1f5f9 !important;
          height: 100% !important;
          display: flex !important;
          align-items: center !important;
          font-weight: 600 !important;
          padding: 0 1.5rem !important;
        }
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
        .custom-pagination .ant-pagination-prev .ant-pagination-item-link,
        .custom-pagination .ant-pagination-next .ant-pagination-item-link {
          border-radius: 1rem;
          background: white;
          border-color: #f1f5f9;
        }
      `}</style>
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-slate-50"><Spin size="large" /></div>}>
      <HotelsContent />
    </Suspense>
  );
}