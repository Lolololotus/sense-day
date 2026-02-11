import type { Metadata } from "next";
import { Geist, Geist_Mono, Nanum_Myeongjo } from "next/font/google"; // Import Nanum Myeongjo
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nanum-myeongjo",
});

export const metadata: Metadata = {
  title: "Sense Your Day | 당신의 하루를 감각하세요",
  description: "사주와 점성술을 통해 당신의 하루를 문장화하고, 맞춤형 예술을 처방하는 감각적 기록관입니다.",
  openGraph: {
    title: "Sense Your Day",
    description: "오늘 당신의 파도는 어떤 모양인가요?",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="km">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nanumMyeongjo.variable} antialiased bg-[#FAF8F5] text-[#2A2A2A] selection:bg-[#E07A5F]/20`}
      >
        <Providers>
          <div className="fixed inset-0 z-[-1]" style={{
            background: "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(244, 63, 94, 0.1) 0%, transparent 50%)"
          }} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
