'use client';

import React from 'react';
import Link from 'next/link';
import { CompassOutlined, GlobalOutlined, HeartOutlined, RocketOutlined } from '@ant-design/icons';
import { ChevronRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO SECTION ── */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80)' }}
        />
        <div className="absolute inset-0 bg-slate-900/40" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl animate-fade-in-up mt-16 md:mt-0 pt-20 pb-10">
           <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-widest md:tracking-[0.2em] leading-snug">
             Hành trình <span className="text-amber-400 italic font-script lowercase tracking-normal">là</span> Sự sống
           </h1>
           <p className="text-sm sm:text-base md:text-xl text-white/90 font-light leading-relaxed max-w-2xl mx-auto">
             Khám phá câu chuyện đằng sau nỗ lực kiến tạo những trải nghiệm du lịch tinh tế từ TravelEasy.
           </p>
        </div>
      </section>

      {/* ── PHILOSOPHY SECTION ── */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
           <div className="space-y-6">
              <div className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                Tầm nhìn 2026
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight tracking-tight">
                Thế giới đang chuyển mình, và <span className="text-blue-600">tâm hồn</span> bạn cũng vậy.
              </h2>
              <div className="h-1 w-20 bg-amber-500 rounded-full" />
           </div>
           <div className="text-slate-500 leading-loose text-base font-light space-y-6">
              <p>
                Trong guồng quay hối hả của kỷ nguyên số, chúng ta thường quên mất cảm giác được chạm tay vào mây trời, 
                được hít hà mùi hương của đất sau cơn mưa rừng, hay đơn giản là được lắng nghe hơi thở của biển cả. 
                Du lịch ngày nay không chỉ là việc di chuyển từ địa điểm này sang địa điểm khác, mà là một cuộc hành trình 
                tìm lại bản ngã, tái tạo năng lượng và kết nối sâu sắc hơn với thế giới rộng lớn.
              </p>
              <p>
                Tại <strong>TravelEasy</strong>, chúng tôi tin rằng mỗi chuyến đi là một chương mới trong cuốn sách cuộc đời. 
                Nó giúp chúng ta xóa tan những định kiến, mở rộng thế giới quan và gom nhặt những kí ức lấp lánh mà 
                không một chiếc màn hình smartphone nào có thể thay thế được.
              </p>
           </div>
        </div>
      </section>

      {/* ── WHY TRAVEL SECTION ── */}
      <section className="bg-slate-50 py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-widest">Tại sao bạn nên đi?</h2>
              <p className="text-slate-400 max-w-xl mx-auto font-light italic">"Đừng chờ đợi cho đến khi bạn sẵn sàng, bởi bạn sẽ không bao giờ sẵn sàng."</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  icon: <HeartOutlined className="text-3xl text-red-400" />,
                  title: "Chữa lành tâm hồn",
                  desc: "Rời xa áp lực công việc và những ồn ào đô thị để tìm thấy sự tĩnh lặng trong thiên nhiên hùng vĩ."
                },
                {
                  icon: <GlobalOutlined className="text-3xl text-blue-400" />,
                  title: "Mở rộng góc nhìn",
                  desc: "Gặp gỡ những nền văn hóa mới, thưởng thức những hương vị lạ lẫm để thấy thế giới này thật bao la."
                },
                {
                  icon: <RocketOutlined className="text-3xl text-amber-400" />,
                  title: "Viết nên ký ức",
                  desc: "Những khoảnh khắc cùng người thân yêu trên những cung đường mới là tài sản vô giá nhất của bạn."
                }
              ].map((item, i) => (
                <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                   <div className="mb-6">{item.icon}</div>
                   <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                   <p className="text-slate-400 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* ── THE TRAVELEASY PROMISE ── */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center space-y-10">
         <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
           Sứ mệnh của <span className="font-script text-blue-600 capitalize text-5xl">TravelEasy</span>
         </h2>
         <p className="text-lg text-slate-500 font-light leading-loose">
           Chúng tôi ra đời không chỉ để bán một tấm vé hay một phòng khách sạn. Chúng tôi ở đây để xóa bỏ mọi rào cản 
           giữa bạn và thế giới. Với công nghệ hiện đại tích hợp cùng trái tim của những người yêu du lịch thuần túy, 
           TravelEasy cam kết mang lại những trải nghiệm "Dễ dàng - Tinh tế - Chân thực" nhất.
         </p>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
            <div className="space-y-1">
               <div className="text-3xl font-black text-slate-900">500+</div>
               <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Đối tác tin cậy</p>
            </div>
            <div className="space-y-1">
               <div className="text-3xl font-black text-slate-900">10k+</div>
               <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Chuyến đi thành công</p>
            </div>
            <div className="space-y-1">
               <div className="text-3xl font-black text-slate-900">24/7</div>
               <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Hỗ trợ tận tâm</p>
            </div>
            <div className="space-y-1">
               <div className="text-3xl font-black text-slate-900">100%</div>
               <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Sự hài lòng</p>
            </div>
         </div>
      </section>

      {/* ── FINAL INSPIRATION ── */}
      <section className="relative h-[50vh] flex items-center justify-center p-6 mb-24 max-w-7xl mx-auto rounded-[3rem] overflow-hidden shadow-2xl">
         <img 
           src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&q=80" 
           alt="Call to action" 
           className="absolute inset-0 w-full h-full object-cover" 
         />
         <div className="absolute inset-0 bg-slate-900/60" />
         <div className="relative z-10 text-center space-y-8 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">
              Thế giới vẫn chờ,<br />còn bạn thì sao?
            </h2>
            <Link 
              href="/tours" 
              className="inline-flex items-center gap-3 px-10 py-4 bg-white text-blue-600 rounded-full font-black uppercase tracking-widest hover:bg-amber-400 hover:text-white transition-all shadow-xl group"
            >
              Bắt đầu hành trình ngay <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
         </div>
      </section>

      {/* FOOTER PADDING */}
      <div className="h-20" />
    </div>
  );
}
