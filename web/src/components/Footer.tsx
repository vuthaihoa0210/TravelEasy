import Image from 'next/image';
import Link from 'next/link';
import { 
  Plane, 
  Hotel, 
  Map, 
  Ticket, 
  ClipboardList, 
  LogIn, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-32 md:pt-40 pb-8 mt-16 border-t border-slate-800 relative z-0">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-blue-600 p-2 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <Image src="/logo.png" priority sizes="40px" alt="TravelEasy Logo" fill className="object-contain p-1" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">TravelEasy<span className="text-blue-500">.</span></span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Nền tảng đặt vé, tour và phòng khách sạn uy tín hàng đầu Việt Nam. Nhanh chóng, an toàn, mang đến những trải nghiệm du lịch tuyệt vời nhất.
            </p>
            <div className="flex items-center gap-4 pt-2">
               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                 <Facebook className="w-5 h-5" />
               </div>
               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                 <Instagram className="w-5 h-5" />
               </div>
               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                 <Twitter className="w-5 h-5" />
               </div>
               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all cursor-pointer">
                 <Youtube className="w-5 h-5" />
               </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">Dịch vụ</h4>
            <div className="flex flex-col gap-4 text-sm font-medium">
              <Link href="/flights" className="hover:text-blue-400 flex items-center gap-2 transition-colors">
                <Plane className="w-4 h-4 opacity-70" /> Đặt vé máy bay
              </Link>
              <Link href="/hotels" className="hover:text-blue-400 flex items-center gap-2 transition-colors">
                <Hotel className="w-4 h-4 opacity-70" /> Đặt phòng khách sạn
              </Link>
              <Link href="/tours" className="hover:text-blue-400 flex items-center gap-2 transition-colors">
                <Map className="w-4 h-4 opacity-70" /> Tour du lịch
              </Link>
              <Link href="/vouchers" className="hover:text-amber-400 flex items-center gap-2 transition-colors">
                <Ticket className="w-4 h-4 opacity-70" /> Ưu đãi & Voucher
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">Hỗ trợ</h4>
            <div className="flex flex-col gap-4 text-sm font-medium">
              <Link href="/bookings" className="hover:text-blue-400 flex items-center gap-2 transition-colors">
                <ClipboardList className="w-4 h-4 opacity-70" /> Lịch sử đặt chỗ
              </Link>
              <Link href="/auth/signin" className="hover:text-blue-400 flex items-center gap-2 transition-colors">
                <LogIn className="w-4 h-4 opacity-70" /> Đăng nhập
              </Link>
              <Link href="/auth/register" className="hover:text-blue-400 flex items-center gap-2 transition-colors">
                <UserPlus className="w-4 h-4 opacity-70" /> Đăng ký tài khoản
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">Liên hệ</h4>
            <div className="flex flex-col gap-4 text-sm font-medium">
              <div className="flex items-center gap-3 group cursor-pointer hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>info@traveleasy.vn</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span>1800 3636</span>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-rose-600 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Hà Nội, Việt Nam</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium uppercase tracking-widest text-slate-500">
          <p>© 2026 TravelEasy. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white">Điều khoản sử dụng</Link>
            <Link href="#" className="hover:text-white">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
