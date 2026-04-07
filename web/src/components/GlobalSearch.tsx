'use client';

import React, { useState } from 'react';
import { Input, Select, Button, Typography } from 'antd';
import { SearchOutlined, CompassOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;
const { Option } = Select;

export default function GlobalSearch() {
  const router = useRouter();
  const [searchType, setSearchType] = useState('tours');
  const [searchDest, setSearchDest] = useState('');

  const handleSearch = () => {
    if (!searchDest.trim()) return;
    router.push(`/${searchType}?search=${encodeURIComponent(searchDest)}`);
  };

  return (
    <div className="max-w-4xl mx-auto my-20 px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-50 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-amber-50/50 rounded-full blur-2xl" />

        <div className="relative z-10 text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
            <CompassOutlined /> Tiếp tục hành trình của bạn
          </div>
          <Title level={2} className="!text-3xl font-black text-slate-900 tracking-tight">
            Bạn vẫn chưa tìm thấy <span className="text-blue-600">điểm đến</span> mong muốn?
          </Title>
          <Text className="text-slate-400 font-light">
            Sử dụng công cụ tìm kiếm thông minh để khám phá hàng ngàn khách sạn, chuyến bay và tour du lịch đặc sắc.
          </Text>
        </div>

        <div className="flex flex-col md:flex-row items-stretch border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-slate-50">
          <Select
            size="large"
            value={searchType}
            onChange={setSearchType}
            className="md:w-44 h-14 custom-search-select !rounded-none border-r border-slate-100"
            variant="borderless"
            style={{ backgroundColor: '#f8fafc' }}
          >
            <Option value="tours">Tour du lịch</Option>
            <Option value="hotels">Khách sạn</Option>
            <Option value="flights">Vé máy bay</Option>
          </Select>

          <div className="flex-1 relative group">
            <input
              type="text"
              placeholder={
                searchType === 'tours' ? "Bạn muốn đi tour ở đâu?" :
                searchType === 'hotels' ? "Bạn muốn lưu trú tại đâu?" :
                "Bạn muốn bay đến thành phố nào?"
              }
              className="w-full h-14 pl-6 pr-4 bg-white border-none focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-700 font-medium text-sm"
              value={searchDest}
              onChange={(e) => setSearchDest(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <Button
            type="primary"
            size="large"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            className="h-14 px-10 !rounded-none font-bold bg-blue-600 hover:bg-blue-700 transition-all border-none min-w-[140px]"
          >
            Tìm ngay
          </Button>
        </div>
        
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setSearchDest('Đà Lạt')}>#Đà Lạt</span>
            <span className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setSearchDest('Phú Quốc')}>#Phú Quốc</span>
            <span className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setSearchDest('Hà Giang')}>#Hà Giang</span>
            <span className="hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setSearchDest('Sa Pa')}>#Sa Pa</span>
        </div>
      </div>
    </div>
  );
}
