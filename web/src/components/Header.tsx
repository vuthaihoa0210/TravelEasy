'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Phone,
  ChevronRight,
  Map,
  Hotel,
  Plane
} from 'lucide-react';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isTransparentPage = pathname === '/' || pathname === '/about';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerBg = !isTransparentPage 
    ? 'bg-slate-900 shadow-lg border-b border-white/10 py-0'
    : (isScrolled 
        ? 'bg-slate-900/90 backdrop-blur-md shadow-lg border-b border-white/10 py-0' 
        : 'bg-transparent');

  const services = [
    { name: 'Tour Du Lịch', href: '/tours', icon: <Map className="w-4 h-4" /> },
    { name: 'Khách Sạn', href: '/hotels', icon: <Hotel className="w-4 h-4" /> },
    { name: 'Vé Máy Bay', href: '/flights', icon: <Plane className="w-4 h-4" /> },
  ];

  if (!mounted) return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900 h-[105px] border-b border-white/5 opacity-80" />
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}>
      {/* Container shared between rows for alignment */}
      <div className="container mx-auto px-4 md:px-10 lg:px-20">
        
        {/* Top Row: Hotline / Auth / Help */}
        <div className="border-b border-white/10 py-1 hidden md:block">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center text-[10px] font-bold uppercase tracking-widest text-white/70">
            {/* Left part: Hotline */}
            <div className="flex items-center gap-0 border-l border-white/10">
               <div className="flex items-center gap-3 px-6 h-10 border-r border-white/10">
                  <img src="https://flagcdn.com/w20/vn.png" alt="VN" className="w-4 h-3 object-cover rounded-sm" />
               </div>
               <div className="flex items-center gap-2 px-6 h-10 border-r border-white/10 hover:text-white transition-colors cursor-pointer">
                  <Phone className="w-3 h-3 text-amber-500" />
                  <span>Hotline: 1800 3636</span>
               </div>
            </div>

            {/* Center: Empty (align with logo) */}
            <div className="w-[180px] md:w-[220px]" />

            {/* Right part: Auth and Help */}
            <div className="flex items-center justify-end border-r border-white/10">
              <div className="flex items-center h-10 border-l border-white/10">
                 {session ? (
                    <div className="flex items-center h-full">
                       <Link href="/profile" className="px-6 hover:text-white transition-colors h-full flex items-center border-r border-white/10 capitalize font-normal">
                          Chào, {session.user?.name}
                       </Link>
                       <button onClick={() => signOut()} className="px-6 hover:text-white transition-colors h-full flex items-center border-r border-white/10">
                          Đăng xuất
                       </button>
                    </div>
                 ) : (
                    <div className="flex items-center h-full">
                       <Link href="/auth/signin" className="px-6 hover:text-white transition-colors h-full flex items-center border-r border-white/10">Đăng nhập</Link>
                       <Link href="/auth/register" className="px-6 hover:text-white transition-colors h-full flex items-center border-r border-white/10">Đăng ký</Link>
                    </div>
                 )}
                 <Link href="/#booking-guide" className="px-6 hover:text-white transition-colors h-full flex items-center border-r border-white/10 uppercase font-bold">Hướng dẫn</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Main Nav + Logo */}
        <div className="py-2 md:py-3">
          <nav className="grid grid-cols-[1fr_auto_1fr] items-center">
            {/* Left Menu Items (Aligned with Hotline start) */}
            <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold text-white uppercase tracking-[0.15em] justify-start">
              <Link href="/" className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
                Trang chủ <ChevronRight className="w-3.5 h-3.5 text-white animate-pulse" strokeWidth={4} />
               </Link>
              <Link href="/about" className="hover:text-amber-500 transition-colors">Giới thiệu</Link>
              
              {/* Explore Dropdown */}
              <div 
                className="relative cursor-pointer group"
                onMouseEnter={() => setIsExploreOpen(true)}
                onMouseLeave={() => setIsExploreOpen(false)}
              >
                <div className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
                  Khám phá <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${isExploreOpen ? 'rotate-180' : ''}`} />
                </div>
                
                <div className={`absolute top-full -left-4 pt-4 w-56 transition-all duration-300 ${isExploreOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                  <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl py-2">
                    {services.map((s) => (
                      <Link 
                        key={s.href} 
                        href={s.href} 
                        className="flex items-center gap-3 px-6 py-3.5 hover:bg-white/5 transition-colors group/item"
                      >
                        <div className="text-white/40 group-hover/item:text-amber-500 transition-colors">
                          {s.icon}
                        </div>
                        <span className="text-[10px] text-white/70 group-hover/item:text-white transition-colors font-bold tracking-widest uppercase">{s.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Center */}
            <div className="px-10">
              <Link href="/" className="flex flex-col items-center group">
                 <span className="text-3xl md:text-4xl font-script text-white group-hover:text-amber-500 transition-colors tracking-tight italic leading-none">
                   TravelEasy
                 </span>
                 <div className="h-0.5 w-12 bg-amber-500 mt-1 opacity-0 group-hover:opacity-100 transition-all rounded-full" />
              </Link>
            </div>

            {/* Right Menu Items (Aligned with Hướng dẫn end) */}
            <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold text-white uppercase tracking-[0.15em] justify-end">
              <Link href="/blogs" className="hover:text-amber-500 transition-colors uppercase">Tin tức</Link>
              <button 
                onClick={() => window.dispatchEvent(new Event('open_chatbot'))}
                className="hover:text-amber-500 transition-colors uppercase font-bold"
              >
                Liên hệ
              </button>
              <Link href="/vouchers" className="hover:text-amber-500 transition-colors uppercase">Ưu đãi</Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden absolute right-4 md:right-10 p-2 text-white hover:text-amber-500 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>

      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 bg-slate-900/98 backdrop-blur-xl z-40 transition-all duration-500 ${
        isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none overflow-hidden'
      }`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-white font-bold uppercase tracking-widest p-6 overflow-y-auto">
           <Link href="/" onClick={()=>setIsMenuOpen(false)} className="text-xl hover:text-amber-500">Trang chủ</Link>
           <Link href="/about" onClick={()=>setIsMenuOpen(false)} className="text-xl hover:text-amber-500">Giới thiệu</Link>
           
           <div className="w-full max-w-[250px] space-y-4 pt-4 border-t border-white/10">
              <p className="text-[10px] text-amber-500 text-center tracking-[0.3em] font-black uppercase">Khám phá</p>
              <div className="flex flex-col gap-5 items-center">
                {services.map(s => (
                  <Link key={s.href} href={s.href} onClick={()=>setIsMenuOpen(false)} className="text-sm text-white/70 hover:text-white flex items-center gap-2">
                    {s.icon} {s.name}
                  </Link>
                ))}
              </div>
           </div>

           <Link href="/blogs" onClick={()=>setIsMenuOpen(false)} className="text-xl hover:text-amber-500">Tin tức</Link>
           <button 
             onClick={() => { setIsMenuOpen(false); window.dispatchEvent(new Event('open_chatbot')); }}
             className="text-xl hover:text-amber-500 uppercase font-bold"
           >
             Liên hệ
           </button>
           <Link href="/vouchers" onClick={()=>setIsMenuOpen(false)} className="text-xl hover:text-amber-500">Ưu đãi</Link>
           <div className="pt-6 flex flex-col items-center gap-4 w-full px-10">
              {session ? (
                 <button onClick={() => signOut()} className="w-full text-sm border border-white/20 py-3 rounded-full">Đăng xuất</button>
              ) : (
                <div className="flex flex-col gap-4 w-full">
                   <Link href="/auth/signin" onClick={()=>setIsMenuOpen(false)} className="w-full text-sm border border-white/20 py-3 rounded-full text-center">Đăng nhập</Link>
                   <Link href="/auth/register" onClick={()=>setIsMenuOpen(false)} className="w-full text-sm bg-blue-600 py-3 rounded-full text-center">Đăng ký</Link>
                </div>
              )}
           </div>
        </div>
        <button onClick={()=>setIsMenuOpen(false)} className="absolute top-8 right-8 text-white"><X className="w-10 h-10" /></button>
      </div>
    </header>
  );
}