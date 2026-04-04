import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/providers";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import ChatBot from "../components/ChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TravelEasy",
  description: "Ứng dụng du lịch Việt Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased`}
      >
        <AntdRegistry>
          <Providers>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <ChatBot />
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
