import DailyCheckIn from "@/components/DailyCheckIn";
import WalletConnect from "@/components/WalletConnect";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#FAF8F5] text-[#2A2A2A] overflow-hidden">

      {/* Main Interaction Component - Handles the full screen layout */}
      <div className="relative z-10">
        <DailyCheckIn />
      </div>

      {/* Footer - Positioned at bottom */}
      <footer className="absolute bottom-6 left-0 w-full text-center space-y-2 z-20 pointer-events-none">

        {/* Wallet Button needs pointer-events-auto */}
        <div className="flex justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-auto mb-4">
          <WalletConnect />
        </div>

        <p className="text-[10px] text-[#3C3C3C]/40 font-sans tracking-widest uppercase">
          © 2026 Sense Your Day
        </p>
      </footer>
    </main>
  );
}
