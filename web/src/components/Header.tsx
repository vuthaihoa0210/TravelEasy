'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Image src="/logo.png" alt="TravelEasy Logo" width={36} height={36} style={{ borderRadius: 8 }} />
          <span className="text-2xl font-bold tracking-tight">TravelEasy</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-4 items-center">
          <Link href="/" className="hover:opacity-80">Trang Chủ</Link>
          <Link href="/flights" className="hover:opacity-80">Đặt Vé Máy Bay</Link>
          <Link href="/tours" className="hover:opacity-80">Tour Du Lịch</Link>
          <Link href="/hotels" className="hover:opacity-80">Đặt Phòng Khách Sạn</Link>
          {session ? (
            <div className="relative group cursor-pointer inline-block">
              <span className="hover:opacity-80 flex items-center gap-1">
                Chào, {session.user?.name} 
                <span className="text-xs">▼</span>
              </span>
              <div className="absolute right-0 top-full pt-4 w-48 z-50 hidden group-hover:block">
                <div className="bg-white text-gray-800 rounded shadow-lg py-2 border border-gray-100">
                  {(session.user as any)?.role === 'ADMIN' && (
                    <>
                      <Link href="/admin/bookings" className="block px-4 py-2 hover:bg-gray-100 font-bold text-blue-600">
                        📋 Quản lý Đơn hàng
                      </Link>
                      <Link href="/admin/chat" className="block px-4 py-2 hover:bg-gray-100 font-bold text-blue-600">
                        💬 Quản lý Chat
                      </Link>
                      <Link href="/admin/blogs" className="block px-4 py-2 hover:bg-gray-100 font-bold text-blue-600">
                        ✍️ Quản lý Bài viết
                      </Link>
                      <Link href="/admin/tours" className="block px-4 py-2 hover:bg-gray-100 font-bold text-blue-600">
                        🗺️ Quản lý Tour
                      </Link>
                      <Link href="/admin/flights" className="block px-4 py-2 hover:bg-gray-100 font-bold text-blue-600">
                        ✈️ Quản lý Máy bay
                      </Link>
                      <Link href="/admin/hotels" className="block px-4 py-2 hover:bg-gray-100 font-bold text-blue-600">
                        🏨 Quản lý Khách sạn
                      </Link>
                    </>
                  )}
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">👤 Trang cá nhân</Link>
                  <Link href="/bookings" className="block px-4 py-2 hover:bg-gray-100">Lịch sử đơn hàng</Link>
                  <button onClick={() => signOut()} className="w-full text-left block px-4 py-2 hover:bg-gray-100 text-red-600">
                    Đăng Xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link href="/auth/signin" className="hover:opacity-80">Đăng Nhập</Link>
              <Link href="/auth/register" className="hover:opacity-80 pt-1 pb-1 px-3 bg-white text-blue-600 rounded">Đăng Ký</Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden flex items-center p-2 text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 pb-2 space-y-2 border-t border-blue-500 pt-4">
          <Link href="/" className="block py-2 hover:bg-blue-700 px-2 rounded">Trang Chủ</Link>
          <Link href="/flights" className="block py-2 hover:bg-blue-700 px-2 rounded">Đặt Vé Máy Bay</Link>
          <Link href="/tours" className="block py-2 hover:bg-blue-700 px-2 rounded">Tour Du Lịch</Link>
          <Link href="/hotels" className="block py-2 hover:bg-blue-700 px-2 rounded">Đặt Phòng Khách Sạn</Link>
          
          {session ? (
            <div className="pt-2 border-t border-blue-500 mt-2">
              <span className="block px-2 py-2 font-bold text-blue-200">Chào, {session.user?.name}</span>
              {(session.user as any)?.role === 'ADMIN' && (
                <>
                  <Link href="/admin/bookings" className="block py-2 px-4 hover:bg-blue-700 rounded text-amber-300">📋 Quản lý Đơn hàng</Link>
                  <Link href="/admin/chat" className="block py-2 px-4 hover:bg-blue-700 rounded text-amber-300">💬 Quản lý Chat</Link>
                  <Link href="/admin/blogs" className="block py-2 px-4 hover:bg-blue-700 rounded text-amber-300">✍️ Quản lý Bài viết</Link>
                  <Link href="/admin/tours" className="block py-2 px-4 hover:bg-blue-700 rounded text-amber-300">🗺️ Quản lý Tour</Link>
                  <Link href="/admin/flights" className="block py-2 px-4 hover:bg-blue-700 rounded text-amber-300">✈️ Quản lý Máy bay</Link>
                  <Link href="/admin/hotels" className="block py-2 px-4 hover:bg-blue-700 rounded text-amber-300">🏨 Quản lý Khách sạn</Link>
                </>
              )}
              <Link href="/profile" className="block py-2 px-4 hover:bg-blue-700 rounded">👤 Trang cá nhân</Link>
              <Link href="/bookings" className="block py-2 px-4 hover:bg-blue-700 rounded">Lịch sử đơn hàng</Link>
              <button onClick={() => signOut()} className="w-full text-left block py-2 px-4 hover:bg-blue-700 text-red-200 rounded">
                Đăng Xuất
              </button>
            </div>
          ) : (
            <div className="flex gap-2 pt-2 border-t border-blue-500">
              <Link href="/auth/signin" className="flex-1 text-center py-2 ring-1 ring-white rounded">Đăng Nhập</Link>
              <Link href="/auth/register" className="flex-1 text-center py-2 bg-white text-blue-600 rounded">Đăng Ký</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}