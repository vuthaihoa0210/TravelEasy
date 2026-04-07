'use client';

import { Button, Card, Col, Row, Space, Tag, Typography, Spin, Divider, Timeline, DatePicker, message, Modal } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, StarFilled, ArrowLeftOutlined, CheckCircleOutlined, LockOutlined } from '@ant-design/icons';
import { Plane, Hotel, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ReviewSection from '@/components/ReviewSection';
import ImageGallery from '@/components/ImageGallery';
import dayjs from 'dayjs';

import GlobalSearch from '@/components/GlobalSearch';

const { Title, Paragraph, Text } = Typography;

interface Tour {
    id: string;
    name: string;
    description?: string;
    location?: string;
    price?: number;
    image?: string;
    rating?: number;
    category?: string;
    itinerary?: string;
    duration?: string;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function TourDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [tour, setTour] = useState<Tour | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params?.id) {
            fetch(`/api/tours/${params.id}`)
                .then(res => res.json())
                .then(data => {
                    setTour(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [params?.id]);

    const [relatedHotels, setRelatedHotels] = useState<any[]>([]);
    const [relatedFlights, setRelatedFlights] = useState<any[]>([]);
    const [viewingProduct, setViewingProduct] = useState<any>(null);
    const [viewType, setViewType] = useState<'hotel' | 'flight' | null>(null);
    const [allTours, setAllTours] = useState<Tour[]>([]);

    useEffect(() => {
        if (tour?.location) {
            // Fetch Hotels
            fetch('/api/hotels')
                .then(res => res.json())
                .then((data: any[]) => {
                    const related = data.filter(h => h.location === tour.location);
                    setRelatedHotels(related.slice(0, 8));
                });

            // Fetch Flights
            fetch('/api/flights')
                .then(res => res.json())
                .then((data: any[]) => {
                    const related = data.filter(f => f.location === tour.location);
                    setRelatedFlights(related.slice(0, 8));
                });

            // Fetch Related Tours
            fetch('/api/tours')
                .then(res => res.json())
                .then((data: any[]) => {
                    // Filter out the current tour
                    const filtered = data.filter((t: Tour) => String(t.id) !== String(params?.id));
                    // Shuffle and take 8 random
                    const shuffled = filtered.sort(() => 0.5 - Math.random());
                    setAllTours(shuffled.slice(0, 8)); 
                });
        }
    }, [tour, params?.id]);

    const handleBooking = () => {
        if (!session) {
            message.error('Vui lòng đăng nhập để đặt tour!');
            return;
        }
        router.push(`/order?type=TOUR&id=${tour?.id}`);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!tour) {
        return (
            <div style={{ textAlign: 'center', padding: '100px' }}>
                <Title level={4}>Không tìm thấy tour</Title>
                <Button onClick={() => router.back()}>Quay lại</Button>
            </div>
        );
    }



    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-36 pb-20">
            <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()} style={{ marginBottom: 20 }}>
                Quay lại danh sách
            </Button>

            <Card style={{ marginBottom: 32 }}>
                <Row gutter={[32, 32]}>
                    <Col xs={24} md={12}>
                        <ImageGallery
                            mainImage={tour.image || ''}
                            productId={tour.id}
                            category="tour"
                            altText={tour.name}
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
                            <div>
                                <Tag color="gold">{tour.category === 'DOMESTIC' ? 'Trong nước' : 'Nước ngoài'}</Tag>
                                <Title level={2} style={{ marginTop: 8 }}>
                                    {tour.name}
                                    {relatedHotels.length > 0 && relatedFlights.length > 0 && (
                                        <span className="text-blue-600 block text-lg font-medium mt-2">
                                            Nghỉ tại {relatedHotels[0].name} + Bay cùng {relatedFlights[0].name}
                                        </span>
                                    )}
                                </Title>
                                <Space>
                                    <StarFilled style={{ color: '#fadb14' }} />
                                    <EnvironmentOutlined />
                                    <Text>{tour.location}</Text>
                                    <Divider orientation="vertical" />
                                    <Tag color="green" className="rounded-full font-bold uppercase text-[9px] border-none px-3 bg-green-50 text-green-600 drop-shadow-sm">
                                        ✨ Đã bao gồm vé máy bay & Khách sạn
                                    </Tag>
                                </Space>
                            </div>

                            <Divider />

                            <Paragraph>{tour.description}</Paragraph>

                            <div>
                                <Title level={5}>Lịch trình chi tiết:</Title>
                                {tour.itinerary ? (() => {
                                    try {
                                        const itineraryList = JSON.parse(tour.itinerary);
                                        return (
                                            <div style={{ marginTop: 16 }}>
                                                {itineraryList.map((day: any, index: number) => (
                                                    <div key={index} style={{ marginBottom: 24 }}>
                                                        <Text strong style={{ fontSize: 16, color: '#faad14' }}>{day.title}</Text>
                                                        <Timeline
                                                            style={{ marginTop: 12 }}
                                                            items={day.activities.map((act: any) => ({
                                                                color: 'blue',
                                                                content: (
                                                                    <>
                                                                        {typeof act === 'string' ? (
                                                                            <Text>{act}</Text>
                                                                        ) : (
                                                                            <>
                                                                                {act.time && <Text strong>{act.time}: </Text>}
                                                                                <Text>{act.description || act}</Text>
                                                                            </>
                                                                        )}
                                                                    </>
                                                                )
                                                            }))}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    } catch (e) {
                                        return <Paragraph>Lịch trình đang cập nhật...</Paragraph>;
                                    }
                                })() : (
                                    <Timeline
                                        items={[
                                            { content: 'Tập trung tại điểm hẹn' },
                                            { content: 'Khởi hành tham quan các địa điểm nổi tiếng' },
                                            { content: 'Ăn trưa tại nhà hàng địa phương' },
                                            { content: 'Tự do khám phá & mua sắm' },
                                            { content: 'Kết thúc chương trình' },
                                        ]}
                                    />
                                )}
                            </div>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* ── BUNDLED SERVICES SECTION ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Hotel Card */}
                {relatedHotels.length > 0 && (
                    <Card 
                        title={
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-black text-slate-400">
                                    <Hotel className="w-4 h-4 text-blue-600" /> Lưu trú cao cấp
                                </div>
                                <Tag color="green" className="m-0 rounded-full text-[8px] font-black border-none bg-green-500 text-white px-2">ĐÃ BAO GỒM</Tag>
                            </div>
                        }
                        className="rounded-2xl shadow-sm border-slate-100 overflow-hidden ring-4 ring-green-500/5"
                        styles={{ body: { padding: 0 } }}
                    >
                        <div className="flex flex-col sm:flex-row h-full">
                            <div className="sm:w-1/3 h-48 sm:h-auto">
                                <img src={relatedHotels[0].image} className="w-full h-full object-cover" alt={relatedHotels[0].name} />
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-1">{relatedHotels[0].name}</h4>
                                    <div className="flex items-center gap-1 text-amber-500 mb-3">
                                        <StarFilled className="text-[10px]" /> <span className="text-xs font-bold">{relatedHotels[0].rating?.toFixed(1)}</span>
                                    </div>
                                    <p className="text-slate-500 text-xs line-clamp-2 mb-4 font-light leading-relaxed">
                                        {relatedHotels[0].description}
                                    </p>
                                </div>
                                <Button 
                                    type="default" 
                                    className="w-full border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50"
                                    onClick={() => {
                                        setViewingProduct(relatedHotels[0]);
                                        setViewType('hotel');
                                    }}
                                >
                                    Xem chi tiết phòng
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Flight Card */}
                {relatedFlights.length > 0 && (
                    <Card 
                        title={
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-black text-slate-400">
                                    <Plane className="w-4 h-4 text-blue-600" /> Hàng không 5 sao
                                </div>
                                <Tag color="green" className="m-0 rounded-full text-[8px] font-black border-none bg-green-500 text-white px-2">ĐÃ BAO GỒM</Tag>
                            </div>
                        }
                        className="rounded-2xl shadow-sm border-slate-100 overflow-hidden ring-4 ring-green-500/5"
                        styles={{ body: { padding: 0 } }}
                    >
                        <div className="flex flex-col sm:flex-row h-full">
                            <div className="sm:w-1/3 h-48 sm:h-auto">
                                <img src={relatedFlights[0].image} className="w-full h-full object-cover" alt={relatedFlights[0].name} />
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-1">{relatedFlights[0].name}</h4>
                                    <Tag color="blue" className="mb-3 rounded-full font-bold uppercase text-[8px] px-2 py-0.5 border-none">Vietnam Airlines / Bamboo</Tag>
                                    <div className="flex items-center gap-4 text-slate-500 text-xs mb-4 mt-2">
                                        <div className="flex items-center gap-1"><ClockCircleOutlined /> 2h 30m</div>
                                        <div className="flex items-center gap-1"><CheckCircleOutlined className="text-green-500" /> Đã bao gồm thuế phí</div>
                                    </div>
                                </div>
                                <Button 
                                    type="default" 
                                    className="w-full border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50"
                                    onClick={() => {
                                        setViewingProduct(relatedFlights[0]);
                                        setViewType('flight');
                                    }}
                                >
                                    Xem chi tiết chuyến bay
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {/* Quick View Modal */}
            <Modal
                open={!!viewingProduct}
                onCancel={() => { setViewingProduct(null); setViewType(null); }}
                footer={null}
                width={800}
                centered
                styles={{ body: { padding: 0 } }}
                className="overflow-hidden rounded-3xl"
            >
                {viewingProduct && (
                    <div className="flex flex-col">
                        <div className="md:h-auto relative">
                             {viewType === 'hotel' ? (
                                <div className="p-8 pb-0">
                                    <ImageGallery 
                                        mainImage={viewingProduct.image} 
                                        productId={viewingProduct.id} 
                                        category="hotel" 
                                        altText={viewingProduct.name} 
                                    />
                                </div>
                             ) : (
                                <div className="h-64 md:h-80 relative">
                                    <img src={viewingProduct.image} className="w-full h-full object-cover" alt={viewingProduct.name} />
                                    <div className="absolute top-6 left-6">
                                        <Tag color="blue" className="rounded-full px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] border-none shadow-xl">
                                            Premium Flight
                                        </Tag>
                                    </div>
                                </div>
                             )}
                        </div>
                        <div className="p-8 md:p-12 space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <Title level={2} className="!mb-0 !font-black tracking-tight">{viewingProduct.name}</Title>
                                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full text-amber-600 font-bold shadow-sm self-start">
                                    <StarFilled className="text-sm" /> {viewingProduct.rating?.toFixed(1)}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100 pb-6">
                                <div className="flex items-center gap-2"><EnvironmentOutlined className="text-blue-600 text-sm" /> {viewingProduct.location}</div>
                                {viewType === 'hotel' && <div className="flex items-center gap-2"><CheckCircleOutlined className="text-blue-600 text-sm" /> 5-Star Facility</div>}
                                {viewType === 'flight' && <div className="flex items-center gap-2"><ClockCircleOutlined className="text-blue-600 text-sm" /> Direct Flight</div>}
                            </div>

                            <div className="space-y-4">
                                <Title level={4} className="!font-bold !text-slate-900">Mô tả dịch vụ</Title>
                                <Paragraph className="text-slate-500 text-sm leading-relaxed font-light">
                                    {viewingProduct.description || "Dịch vụ đẳng cấp được chọn lọc kỹ lưỡng để đảm bảo hành trình của bạn trọn vẹn nhất."}
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </Paragraph>
                            </div>

                            <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {viewType === 'hotel' ? [
                                    { icon: <CheckCircleOutlined />, text: 'Wifi miễn phí' },
                                    { icon: <CheckCircleOutlined />, text: 'Hồ bơi' },
                                    { icon: <CheckCircleOutlined />, text: 'Ăn sáng' },
                                    { icon: <CheckCircleOutlined />, text: 'Spa & Gym' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-slate-800 font-bold text-[10px] uppercase tracking-widest bg-slate-50 p-3 rounded-xl">
                                        <span className="text-blue-600">{item.icon}</span> {item.text}
                                    </div>
                                )) : [
                                    { icon: <CheckCircleOutlined />, text: 'Hành lý 20kg' },
                                    { icon: <CheckCircleOutlined />, text: 'Suất ăn' },
                                    { icon: <CheckCircleOutlined />, text: 'Ghế rộng' },
                                    { icon: <CheckCircleOutlined />, text: 'Giải trí' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-slate-800 font-bold text-[10px] uppercase tracking-widest bg-slate-50 p-3 rounded-xl">
                                        <span className="text-blue-600">{item.icon}</span> {item.text}
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => { setViewingProduct(null); setViewType(null); }}
                                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl"
                            >
                                Quay lại Tour
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
            {/* ── FINAL BOOKING SECTION ── */}
            <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 mb-16 relative overflow-hidden shadow-2xl group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl -ml-10 -mb-10" />
                
                <Row align="middle" justify="space-between" gutter={[32, 32]} className="relative z-10">
                    <Col xs={24} lg={16}>
                        <div className="space-y-4">
                            <Tag color="gold" className="rounded-full border-none px-4 py-1.5 font-black uppercase text-[10px] tracking-[0.2em] bg-amber-500 text-slate-900">Combo Trọn Gói</Tag>
                            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">Trải nghiệm kỳ nghỉ <span className="text-amber-500">đẳng cấp</span></h3>
                            <p className="text-slate-400 text-sm max-w-xl font-light leading-relaxed">
                                Giá đã bao gồm đầy đủ Tour du lịch, Vé máy bay khứ hồi và Khách sạn cao cấp tại {tour.location}. Không phát sinh chi phí.
                            </p>
                        </div>
                    </Col>
                    <Col xs={24} lg={8} className="text-center lg:text-right">
                        <div className="flex flex-col gap-6 items-center lg:items-end">
                            <div className="text-right">
                                <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest block mb-2">Giá trọn gói mỗi khách</span>
                                <span className="text-5xl font-black text-white leading-none tracking-tighter">{formatCurrency(tour.price || 0)}</span>
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                className="h-16 px-12 rounded-2xl font-black text-sm uppercase tracking-widest bg-blue-600 hover:bg-blue-700 border-none transition-all hover:scale-105 shadow-xl hover:shadow-blue-600/20 w-full"
                                onClick={handleBooking}
                            >
                                Đặt ngay hành trình
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>

            <ReviewSection type="TOUR" itemId={Number(params.id)} />


            {allTours.length > 0 && (
                <div style={{ marginTop: 64 }}>
                    <Divider />
                    <Title level={3} style={{ marginBottom: 32, textAlign: 'center' }}>Tour du lịch khác bạn có thể thích</Title>
                    <Row gutter={[24, 32]}>
                        {allTours.map((t) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={t.id}>
                                <div 
                                    onClick={() => {
                                        router.push(`/tours/${t.id}`);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-700 cursor-pointer flex flex-col h-full hover:-translate-y-2"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                        <div className="absolute top-3 left-3">
                                            <Tag color="black" className="rounded-full px-2 py-0.5 bg-black/80 backdrop-blur text-white border-none font-bold uppercase text-[7px] tracking-widest shadow-lg">
                                                {t.category === 'INTERNATIONAL' ? 'Quốc tế' : 'Trong nước'}
                                            </Tag>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1 space-y-3">
                                        <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em]">
                                            <EnvironmentOutlined className="w-2.5 h-2.5" /> {t.location}
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug tracking-tight h-12">
                                            {t.name}
                                        </h3>
                                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Giá trọn gói</span>
                                                <span className="text-lg font-black text-slate-900 leading-none mt-1">{formatCurrency(t.price || 0)}</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 flex items-center justify-center">
                                                <ArrowLeftOutlined rotate={180} className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
            <GlobalSearch />
        </div>
    );
}
