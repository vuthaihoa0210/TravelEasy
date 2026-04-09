'use client';

import { Button, Card, Col, Row, Space, Tag, Typography, Spin, Divider, Timeline, DatePicker, message, Modal, Image } from 'antd';
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
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    const [selectedFlightId, setSelectedFlightId] = useState<number | null>(null);
    // Detail modal state
    const [detailItem, setDetailItem] = useState<any>(null);
    const [detailType, setDetailType] = useState<'hotel' | 'flight' | null>(null);
    const [allTours, setAllTours] = useState<Tour[]>([]);

    // Derived: selected hotel & flight objects
    const selectedHotel = relatedHotels.find(h => h.id === selectedHotelId) || null;
    const selectedFlight = relatedFlights.find(f => f.id === selectedFlightId) || null;

    // Dynamic total price
    const totalPrice = (tour?.price || 0) + (selectedHotel?.price || 0) + (selectedFlight?.price || 0);

    useEffect(() => {
        if (tour?.location) {
            // Fetch Hotels
            fetch('/api/hotels')
                .then(res => res.json())
                .then((data: any[]) => {
                    const related = data.filter(h => h.location === tour.location);
                    setRelatedHotels(related.slice(0, 8));
                    if (related.length > 0) setSelectedHotelId(related[0].id);
                });

            // Fetch Flights — ALL flights to this destination, regardless of departure city
            fetch('/api/flights')
                .then(res => res.json())
                .then((data: any[]) => {
                    const related = data.filter(f => f.location === tour.location);
                    setRelatedFlights(related.slice(0, 12));
                    if (related.length > 0) setSelectedFlightId(related[0].id);
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
        let url = `/order?type=TOUR&id=${tour?.id}`;
        if (selectedHotelId) url += `&hotelId=${selectedHotelId}`;
        if (selectedFlightId) url += `&flightId=${selectedFlightId}`;
        router.push(url);
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
            <div className="mb-12 space-y-8">

                {/* Hotel Selection */}
                {relatedHotels.length > 0 && (
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-black text-slate-400">
                                <Hotel className="w-4 h-4 text-blue-600" /> Chọn khách sạn lưu trú
                            </div>
                            <Tag color="green" className="m-0 rounded-full text-[8px] font-black border-none bg-green-500 text-white px-2">ĐÃ BAO GỒM</Tag>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {relatedHotels.map((hotel) => (
                                <div
                                    key={hotel.id}
                                    onClick={() => setSelectedHotelId(hotel.id)}
                                    className={`cursor-pointer rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                                        selectedHotelId === hotel.id
                                            ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-lg'
                                            : 'border-slate-100 hover:border-blue-200 hover:shadow-md'
                                    }`}
                                >
                                    <div className="relative h-36 overflow-hidden">
                                        <img
                                            src={`https://picsum.photos/seed/hotel-${hotel.id}/400/240`}
                                            className="w-full h-full object-cover"
                                            alt={hotel.name}
                                        />
                                        {selectedHotelId === hotel.id && (
                                            <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                                ✓
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p className="font-bold text-slate-900 text-sm line-clamp-1">{hotel.name}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 text-amber-500 text-xs">
                                                    <StarFilled style={{ fontSize: 10 }} />
                                                    <span className="font-bold">{hotel.rating?.toFixed(1)}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-medium">• {hotel.location}</span>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setDetailItem(hotel); setDetailType('hotel'); }}
                                                className="text-[10px] font-bold text-blue-500 hover:text-blue-700 underline whitespace-nowrap"
                                            >
                                                Chi tiết
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Flight Selection */}
                {relatedFlights.length > 0 && (
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-black text-slate-400">
                                <Plane className="w-4 h-4 text-blue-600" /> Chọn chuyến bay đến {tour.location}
                            </div>
                            <Tag color="green" className="m-0 rounded-full text-[8px] font-black border-none bg-green-500 text-white px-2">ĐÃ BAO GỒM</Tag>
                        </div>
                        <p className="text-xs text-slate-400 mb-3 font-light">Chọn chuyến bay phù hợp từ thành phố của bạn — tất cả đều đến {tour.location}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {relatedFlights.map((flight) => (
                                <div
                                    key={flight.id}
                                    onClick={() => setSelectedFlightId(flight.id)}
                                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 flex items-center gap-4 ${
                                        selectedFlightId === flight.id
                                            ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-500/10 shadow-md'
                                            : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                        selectedFlightId === flight.id ? 'bg-blue-500' : 'bg-slate-100'
                                    }`}>
                                        <Plane className={`w-5 h-5 ${
                                            selectedFlightId === flight.id ? 'text-white' : 'text-slate-400'
                                        }`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-900 text-sm line-clamp-1">{flight.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                                                {flight.code || 'VN'}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                                <CheckCircleOutlined className="text-green-500" /> Đến: {flight.location}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-xs text-slate-400">+thêm</p>
                                        <p className="font-black text-blue-600 text-sm">
                                            {formatCurrency(flight.price)}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1 flex-shrink-0">
                                        {selectedFlightId === flight.id ? (
                                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</div>
                                        ) : (
                                            <div className="w-6 h-6" />
                                        )}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setDetailItem(flight); setDetailType('flight'); }}
                                            className="text-[9px] font-bold text-blue-500 hover:text-blue-700 underline whitespace-nowrap"
                                        >
                                            Chi tiết
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── DETAIL MODAL ── */}
            <Modal
                open={!!detailItem}
                onCancel={() => { setDetailItem(null); setDetailType(null); }}
                footer={null}
                width={760}
                centered
                styles={{ body: { padding: 0 } }}
                className="overflow-hidden rounded-3xl"
            >
                {detailItem && (
                    <div className="flex flex-col">
                        {/* Image */}
                        <div className="h-56 md:h-72 relative overflow-hidden rounded-t-3xl bg-slate-100">
                            <Image.PreviewGroup>
                                <div className="absolute inset-0 w-full h-full [&>.ant-image]:w-full [&>.ant-image]:h-full [&_img]:object-cover [&_img]:w-full [&_img]:h-full">
                                    <Image
                                        src={`https://picsum.photos/seed/${detailType}-${detailItem.id}-0/1200/800`}
                                        alt={detailItem.name}
                                        preview={{ cover: <span className="text-white text-sm font-bold drop-shadow-md">🔍 Xem tất cả ảnh</span> }}
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                                <div className="absolute bottom-4 left-6 right-6 pointer-events-none">
                                    <p className="text-white font-black text-2xl leading-tight drop-shadow-lg">{detailItem.name}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                                            <StarFilled style={{ fontSize: 12 }} /> {detailItem.rating?.toFixed(1)}
                                        </div>
                                        <span className="text-white/70 text-xs">{detailItem.location}</span>
                                        <Tag
                                            color={detailType === 'hotel' ? 'blue' : 'purple'}
                                            className="border-none rounded-full text-[8px] font-black px-2 m-0"
                                        >
                                            {detailType === 'hotel' ? '🏨 Khách sạn' : '✈️ Chuyến bay'}
                                        </Tag>
                                    </div>
                                </div>
                                {/* Thumbnail strip */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-16 h-12 rounded-xl overflow-hidden border-2 border-white/80 shadow-lg cursor-pointer hover:border-white transition-all hover:scale-105 [&>.ant-image]:w-full [&>.ant-image]:h-full [&_img]:object-cover [&_img]:w-full [&_img]:h-full">
                                            <Image
                                                src={`https://picsum.photos/seed/${detailType}-${detailItem.id}-${i}/800/500`}
                                                alt=""
                                                preview={{ mask: false }}
                                            />
                                        </div>
                                    ))}
                                    {/* Hidden extra gallery images */}
                                    <div style={{ display: 'none' }}>
                                        {[4, 5, 6, 7].map(i => (
                                            <Image
                                                key={i}
                                                src={`https://picsum.photos/seed/${detailType}-${detailItem.id}-${i}/1200/800`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </Image.PreviewGroup>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8 space-y-5">
                            {/* Description */}
                            <p className="text-slate-500 text-sm leading-relaxed font-light">
                                {detailItem.description || (detailType === 'hotel'
                                    ? 'Khách sạn đẳng cấp với không gian sang trọng, hiện đại và dịch vụ chuyên nghiệp. Vị trí thuận tiện, gần các điểm tham quan nổi tiếng.'
                                    : 'Chuyến bay chất lượng cao với đội ngũ phi hành đoàn chuyên nghiệp. Hành lý, bữa ăn và giải trí trên chuyến bay đều được bố trí kỹ lưỡng.'
                                )}
                            </p>

                            {/* Amenities */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {(detailType === 'hotel' ? [
                                    { icon: '📶', text: 'Wifi miễn phí' },
                                    { icon: '🏊', text: 'Hồ bơi' },
                                    { icon: '🍳', text: 'Ăn sáng' },
                                    { icon: '💆', text: 'Spa & Gym' },
                                    { icon: '🅿️', text: 'Bãi đỗ xe' },
                                    { icon: '🛎️', text: 'Lễ tân 24/7' },
                                    { icon: '❄️', text: 'Điều hòa' },
                                    { icon: '🛁', text: 'Bồn tắm' },
                                ] : [
                                    { icon: '🧳', text: 'Hành lý 20kg' },
                                    { icon: '🍱', text: 'Suất ăn' },
                                    { icon: '💺', text: 'Ghế rộng' },
                                    { icon: '🎬', text: 'Giải trí' },
                                    { icon: '⚡', text: 'Sạc điện' },
                                    { icon: '📶', text: 'Wifi' },
                                    { icon: '✅', text: 'Đúng giờ' },
                                    { icon: '🏷️', text: 'Thuế phí' },
                                ]).map((a, i) => (
                                    <div key={i} className="flex items-center gap-2 text-slate-700 text-xs font-semibold bg-slate-50 px-3 py-2 rounded-xl">
                                        <span>{a.icon}</span> {a.text}
                                    </div>
                                ))}
                            </div>

                            {/* Price breakdown */}
                            <div className="bg-blue-50 rounded-2xl p-4 space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Chi phí thêm vào tour</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">{detailType === 'hotel' ? 'Khách sạn' : 'Vé máy bay'}</span>
                                    <span className="font-black text-blue-600 text-lg">+{formatCurrency(detailItem.price || 0)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-400 border-t border-blue-100 pt-2">
                                    <span>Giá tour cơ bản</span>
                                    <span>{formatCurrency(tour.price || 0)}</span>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setDetailItem(null); setDetailType(null); }}
                                    className="flex-1 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:border-slate-300 transition-all"
                                >
                                    Đóng
                                </button>
                                <button
                                    onClick={() => {
                                        if (detailType === 'hotel') setSelectedHotelId(detailItem.id);
                                        else setSelectedFlightId(detailItem.id);
                                        setDetailItem(null); setDetailType(null);
                                    }}
                                    className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                                >
                                    ✓ Chọn {detailType === 'hotel' ? 'khách sạn' : 'chuyến bay'} này
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
            {/* ── FINAL BOOKING SECTION ── */}
            <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 mb-16 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl -ml-10 -mb-10" />

                <Row align="middle" justify="space-between" gutter={[32, 32]} className="relative z-10">
                    <Col xs={24} lg={14}>
                        <div className="space-y-4">
                            <Tag color="gold" className="rounded-full border-none px-4 py-1.5 font-black uppercase text-[10px] tracking-[0.2em] bg-amber-500 text-slate-900">Combo Trọn Gói</Tag>
                            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Tổng chi phí hành trình <span className="text-amber-500">của bạn</span></h3>
                            {/* Price breakdown */}
                            <div className="space-y-2 mt-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">🗺️ Tour {tour.name}</span>
                                    <span className="text-white font-bold">{formatCurrency(tour.price || 0)}</span>
                                </div>
                                {selectedHotel && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">🏨 {selectedHotel.name}</span>
                                        <span className="text-white font-bold">+{formatCurrency(selectedHotel.price || 0)}</span>
                                    </div>
                                )}
                                {selectedFlight && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">✈️ {selectedFlight.name}</span>
                                        <span className="text-white font-bold">+{formatCurrency(selectedFlight.price || 0)}</span>
                                    </div>
                                )}
                                <div className="border-t border-slate-700 pt-2 flex justify-between items-center">
                                    <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">Tổng cộng / khách</span>
                                    <span className="text-amber-400 font-black text-lg">{formatCurrency(totalPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} lg={10} className="text-center lg:text-right">
                        <div className="flex flex-col gap-4 items-center lg:items-end">
                            <div className="text-right">
                                <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest block mb-1">Giá trọn gói mỗi khách</span>
                                <span className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter transition-all duration-500">{formatCurrency(totalPrice)}</span>
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                className="h-14 px-10 rounded-2xl font-black text-sm uppercase tracking-widest bg-blue-600 hover:bg-blue-700 border-none transition-all hover:scale-105 shadow-xl w-full"
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
