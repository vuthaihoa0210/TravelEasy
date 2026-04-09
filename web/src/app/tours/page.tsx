'use client';

import { Col, Row, Tag, Select, Pagination, Slider, Spin } from 'antd';
import { useMemo, useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Star, ArrowRight, Search, Calendar, Hotel, Plane } from 'lucide-react';

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
  duration?: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const removeAccents = (str: string) => {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u0111/g, 'd').replace(/\u0110/g, 'D').toLowerCase();
};

function getTourCardImage(id: string | number): string {
  return `https://picsum.photos/seed/tour-${id}/600/400`;
}

function ToursContent() {
  const router = useRouter();
  const [tours, setTours] = useState<Destination[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string | undefined>('price-asc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000000]);

  useEffect(() => {
    Promise.all([
      fetch('/api/tours').then(res => res.json()),
      fetch('/api/hotels').then(res => res.json())
    ]).then(([toursData, hotelsData]) => {
      setTours(toursData);
      setHotels(hotelsData);
      setLoading(false);
    }).catch(err => {
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

  const filteredAndSortedTours = useMemo(() => {
    let filtered = tours;
    
    /* Removed duplicate location filter to allow Hà Nội 3N2Đ and Hà Nội 5N4Đ */

    if (activeTab !== 'ALL') {
      filtered = filtered.filter(t => t.category === activeTab);
    }
    
    if (searchTerm.trim()) {
      const term = removeAccents(searchTerm);
      filtered = filtered.filter(t => 
        (t.location && removeAccents(t.location).includes(term)) ||
        removeAccents(t.name).includes(term)
      );
    }

    filtered = filtered.filter(t => (t.price || 0) >= priceRange[0] && (t.price || 0) <= priceRange[1]);

    if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return filtered;
  }, [tours, activeTab, searchTerm, sortBy, priceRange]);

  const pagedTours = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedTours.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredAndSortedTours]);

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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Hành trình <span className="text-blue-600">vô tận</span></h1>
          <p className="text-base text-slate-500 max-w-xl font-light">
            Khám phá những điểm đến tuyệt vời nhất với lịch trình được thiết kế riêng.
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
                  placeholder="Bạn muốn đi đâu?..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-700 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={7}>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                  <span>Khoảng giá</span>
                  <span className="text-blue-600 lowercase font-medium">{formatCurrency(priceRange[1])}</span>
                </div>
                <Slider
                  range
                  min={0}
                  max={30000000}
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
                placeholder="Sắp xếp"
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
           <div className="flex gap-8">
             {tabItems.map(tab => (
               <button 
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
                className={`cursor-pointer pb-4 text-[10px] font-bold tracking-[0.2em] uppercase transition-all relative ${
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
            <div className="text-slate-400 font-medium tracking-widest uppercase text-[10px]">Đang chuẩn bị những hành trình tốt nhất...</div>
          </div>
        ) : (
          <>
            <Row gutter={[32, 40]}>
              {pagedTours.map((t) => (
                <Col xs={24} sm={12} md={8} lg={6} key={t.id}>
                  <div 
                    onClick={() => router.push(`/tours/${t.id}`)}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-700 cursor-pointer flex flex-col h-full hover:-translate-y-2"
                  >
                    <div className="relative h-56 overflow-hidden">
                       <img src={getTourCardImage(t.id)} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                       <div className="absolute top-4 left-4">
                         <div className="px-2 py-0.5 bg-white/90 backdrop-blur-md text-blue-600 rounded-full font-bold uppercase text-[8px] tracking-widest shadow-lg">
                           {t.category === 'INTERNATIONAL' ? 'Quốc tế' : 'Trong nước'}
                         </div>
                       </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em]">
                           <MapPin className="w-2.5 h-2.5" /> {t.location}
                         </div>
                         <div className="flex items-center gap-1 text-amber-500 font-bold text-[10px] bg-amber-50 px-1.5 py-0.5 rounded-full">
                           <Star className="w-2.5 h-2.5 fill-amber-500" /> {t.rating?.toFixed(1)}
                         </div>
                      </div>
                      
                       <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug tracking-tight h-12">
                          {t.name}
                        </h3>
                        
                        <div className="flex flex-col gap-1.5 mt-1">
                          {(() => {
                            const hotelMatch = hotels.find((h: any) => 
                              h.location?.toLowerCase().includes(t.location?.toLowerCase() || '') ||
                              t.location?.toLowerCase().includes(h.location?.toLowerCase() || '')
                            );
                            return (
                              <div className="flex items-center gap-1.5 text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50/50 w-fit px-2 py-0.5 rounded-full">
                                <Hotel className="w-2.5 h-2.5" /> {hotelMatch?.name || 'Khách sạn Resort & Spa'}
                              </div>
                            );
                          })()}
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 w-fit px-2 py-0.5 rounded-full">
                            <Plane className="w-2.5 h-2.5" /> Vietnam Airlines / Bamboo
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div className="flex flex-col">
                           <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Giá trọn gói</span>
                           <span className="text-lg font-black text-slate-900 leading-none mt-1 tracking-tighter">{formatCurrency(t.price || 0)}</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 flex items-center justify-center group-hover:scale-105">
                           <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            {filteredAndSortedTours.length > PAGE_SIZE && (
              <div className="mt-20 flex justify-center">
                <Pagination
                  current={currentPage}
                  pageSize={PAGE_SIZE}
                  total={filteredAndSortedTours.length}
                  onChange={(page) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  showSizeChanger={false}
                  className="custom-pagination"
                />
              </div>
            )}
            
            {filteredAndSortedTours.length === 0 && (
              <div className="py-40 text-center space-y-6 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                 <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                   <Search className="w-10 h-10" />
                 </div>
                 <div className="space-y-2">
                   <h3 className="text-2xl font-bold text-slate-900">Không tìm thấy kết quả</h3>
                   <p className="text-slate-400 font-light max-w-sm mx-auto">Chúng tôi không tìm thấy tour nào phù hợp với các tiêu chí tìm kiếm của bạn.</p>
                 </div>
                 <button onClick={() => { setSearchTerm(''); setActiveTab('ALL'); setPriceRange([0, 30000000]); }} className="px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-blue-600 transition-colors">Thiết lập lại bộ lọc</button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Search styles for antd components */}
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

export default function ToursPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-slate-50"><Spin size="large" /></div>}>
      <ToursContent />
    </Suspense>
  );
}