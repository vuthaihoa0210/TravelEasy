'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Divider } from 'antd';
import { 
  ChevronDown, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Phone,
  Sun,
  Moon,
  ChevronRight,
  Map,
  Hotel,
  Plane
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isHomeOpen, setIsHomeOpen] = useState(false);
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
    <>
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
                    <div className="flex items-center h-full relative group">
                       <div className="px-6 hover:text-white transition-colors h-full flex items-center border-r border-white/10 capitalize font-normal cursor-pointer gap-1">
                          Chào, {session.user?.name} <ChevronDown className="w-3 h-3 text-amber-500 transition-transform group-hover:rotate-180" />
                       </div>
                       
                       <div className="absolute top-[35px] right-0 pt-4 w-52 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl py-2 flex flex-col">
                             <Link href="/profile" className="px-6 py-3 text-white/70 hover:text-white hover:bg-white/5 transition-colors font-bold tracking-widest text-[10px] uppercase">
                                Trang cá nhân
                             </Link>
                             {(session?.user as any)?.role === 'ADMIN' && (
                               <Link href="/admin/bookings" className="px-6 py-3 text-yellow-500/80 hover:text-yellow-400 hover:bg-white/5 transition-colors font-bold tracking-widest text-[10px] uppercase">
                                  Trang Quản Trị
                               </Link>
                             )}
                             <button onClick={() => signOut()} className="cursor-pointer px-6 py-3 text-left text-white/70 hover:text-red-400 hover:bg-white/5 transition-colors font-bold tracking-widest text-[10px] uppercase">
                                Đăng xuất
                             </button>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="flex items-center h-full">
                       <Link href="/auth/signin" className="px-6 hover:text-white transition-colors h-full flex items-center border-r border-white/10">Đăng nhập</Link>
                       <Link href="/auth/register" className="px-6 hover:text-white transition-colors h-full flex items-center border-r border-white/10">Đăng ký</Link>
                    </div>
                 )}
                 <Link 
                    href="/#booking-guide" 
                    onClick={(e) => {
                      if (pathname === '/') {
                        e.preventDefault();
                        document.getElementById('booking-guide')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="px-6 hover:text-white transition-colors h-full flex items-center border-r border-white/10 uppercase font-bold"
                 >
                    Hướng dẫn
                 </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Main Nav + Logo */}
        <div className="py-2 md:py-3">
          <nav className="grid grid-cols-[1fr_auto_1fr] items-center">
            {/* Left Menu Items (Aligned with Hotline start) */}
            <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold text-white uppercase tracking-[0.15em] justify-start">
              {/* Trang chủ with Dropdown for Theme */}
              <div 
                className="relative cursor-pointer group"
                onMouseEnter={() => setIsHomeOpen(true)}
                onMouseLeave={() => setIsHomeOpen(false)}
              >
                <div className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
                  Trang chủ <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${isHomeOpen ? 'rotate-180' : ''}`} />
                </div>
                
                <div className={`absolute top-full -left-4 pt-4 w-56 transition-all duration-300 ${isHomeOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                  <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl py-2">
                    <Link href="/" className="flex items-center gap-3 px-6 py-3.5 hover:bg-white/5 transition-colors group/item">
                       <ChevronRight className="w-4 h-4 text-white/40 group-hover/item:text-amber-500" strokeWidth={3} />
                       <span className="text-[10px] text-white/70 group-hover/item:text-white font-bold tracking-widest uppercase">Về trang chủ</span>
                    </Link>
                    <Divider className="my-1 border-white/5" />
                    <button 
                      onClick={() => setTheme('light')}
                      className={`w-full flex items-center gap-3 px-6 py-3.5 hover:bg-white/5 transition-colors group/item ${theme === 'light' ? 'bg-white/10' : ''}`}
                    >
                      <Sun className={`w-4 h-4 ${theme === 'light' ? 'text-amber-500' : 'text-white/40 group-hover/item:text-amber-500'}`} />
                      <span className={`text-[10px] uppercase font-bold tracking-widest ${theme === 'light' ? 'text-white' : 'text-white/70 group-hover/item:text-white'}`}>Chế độ sáng</span>
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`w-full flex items-center gap-3 px-6 py-3.5 hover:bg-white/5 transition-colors group/item ${theme === 'dark' ? 'bg-white/10' : ''}`}
                    >
                      <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-white/40 group-hover/item:text-blue-400'}`} />
                      <span className={`text-[10px] uppercase font-bold tracking-widest ${theme === 'dark' ? 'text-white' : 'text-white/70 group-hover/item:text-white'}`}>Chế độ tối</span>
                    </button>
                  </div>
                </div>
              </div>

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
                className="cursor-pointer hover:text-amber-500 transition-colors uppercase font-bold"
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
    </header>

      {/* Mobile Menu Backdrop - Outside header to avoid backdrop-blur inheritance */}
      <div 
        className={`lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Drawer Sidebar - Outside header to avoid backdrop-blur inheritance */}
      <div 
        className={`lg:hidden fixed top-0 right-0 bottom-0 w-[80%] max-w-[320px] z-[70] bg-slate-900 shadow-2xl transition-transform duration-300 ease-out transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full bg-slate-900 border-l border-white/10">
          {/* Header of Sidebar */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <span className="text-xl font-script text-amber-500 italic">TravelEasy</span>
            <button onClick={()=>setIsMenuOpen(false)} className="text-white hover:text-amber-500 transition-colors">
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-6 px-6 space-y-4">
            <Link href="/" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-3 text-sm text-white/90 hover:text-amber-500 font-bold uppercase tracking-widest transition-all">
              <ChevronRight className="w-4 h-4 text-amber-500" /> Trang chủ
            </Link>
            <Link href="/about" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-3 text-sm text-white/90 hover:text-amber-500 font-bold uppercase tracking-widest transition-all">
              <ChevronRight className="w-4 h-4 text-amber-500" /> Giới thiệu
            </Link>
            
            <div className="py-2 space-y-3">
              <p className="text-[9px] text-amber-500 font-black uppercase tracking-[0.3em] mb-2">Khám phá</p>
              {services.map(s => (
                <Link key={s.href} href={s.href} onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-3 pl-2 text-xs text-white/50 hover:text-white transition-colors uppercase font-bold tracking-widest">
                  <span className="text-amber-500/50">{s.icon}</span> {s.name}
                </Link>
              ))}
            </div>

            <Link href="/blogs" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-3 text-sm text-white/90 hover:text-amber-500 font-bold uppercase tracking-widest transition-all">
              <ChevronRight className="w-4 h-4 text-amber-500" /> Tin tức
            </Link>
            <button 
              onClick={() => { setIsMenuOpen(false); window.dispatchEvent(new Event('open_chatbot')); }}
              className="w-full flex items-center gap-3 text-sm text-white/90 hover:text-amber-500 font-bold uppercase tracking-widest transition-all text-left"
            >
              <ChevronRight className="w-4 h-4 text-amber-500" /> Liên hệ
            </button>
            <Link href="/vouchers" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-3 text-sm text-white/90 hover:text-amber-500 font-bold uppercase tracking-widest transition-all">
              <ChevronRight className="w-4 h-4 text-amber-500" /> Ưu đãi
            </Link>

            {/* Theme Toggle in Aligned format */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <p className="text-[9px] text-amber-500 font-black uppercase tracking-[0.3em] mb-2">Giao diện</p>
              <div className="flex gap-2">
                 <button 
                   onClick={() => setTheme('light')}
                   className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all ${theme === 'light' ? 'bg-amber-500 border-amber-500 text-slate-900' : 'border-white/10 text-white/40'}`}
                 >
                   <Sun className="w-4 h-4" /> <span className="text-[10px] uppercase font-bold">Sáng</span>
                 </button>
                 <button 
                   onClick={() => setTheme('dark')}
                   className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all ${theme === 'dark' ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/10 text-white/40'}`}
                 >
                   <Moon className="w-4 h-4" /> <span className="text-[10px] uppercase font-bold">Tối</span>
                 </button>
              </div>
            </div>
          </div>

          {/* Sidebar Footer with Greeting */}
          <div className="p-6 bg-white/5 border-t border-white/10 space-y-4">
            {session ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Xin chào,</span>
                    <span className="text-sm text-white font-bold capitalize">{session.user?.name}</span>
                  </div>
                </div>
                <button onClick={() => signOut()} className="w-full flex items-center justify-center gap-2 text-[10px] text-red-400 font-bold uppercase tracking-[0.2em] border border-red-400/20 py-3 rounded-xl hover:bg-red-400/10 transition-all">
                   <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                 <Link href="/auth/signin" onClick={()=>setIsMenuOpen(false)} className="w-full text-[10px] text-center text-white font-bold uppercase tracking-[0.2em] border border-white/20 py-3 rounded-xl hover:bg-white/5 transition-all">
                    Đăng nhập
                 </Link>
                 <Link href="/auth/register" onClick={()=>setIsMenuOpen(false)} className="w-full text-[10px] text-center text-slate-900 bg-blue-600 font-bold uppercase tracking-[0.2em] py-3 rounded-xl hover:bg-blue-700 transition-all">
                    Đăng ký
                 </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}