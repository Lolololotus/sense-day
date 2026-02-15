"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserProfile {
    name: string;
    birthDate: string;
    birthTime: string;
    birthTimeUnknown?: boolean;
    birthCity: string;
    feeling: string;
}

interface AIResponse {
    today_advice: string;
    curious_question: string;
    time_sense: string;
    art_curation: {
        title: string;
        description: string;
        color_code: string;
        music_recommendation?: string;
    };
    id?: number;
}

export default function DailyCheckIn() {
    const router = useRouter();
    const [step, setStep] = useState<"intro" | "name" | "birth" | "city" | "feeling" | "loading">("intro");
    const [profile, setProfile] = useState<UserProfile>({
        name: "",
        birthDate: "",
        birthTime: "",
        birthCity: "",
        feeling: ""
    });

    const handleNext = () => {
        if (step === "intro") setStep("name");
        else if (step === "name" && profile.name) setStep("birth");
        else if (step === "birth" && profile.birthDate) setStep("city");
        else if (step === "city" && profile.birthCity) setStep("feeling");
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!profile.feeling.trim()) return;
        setStep("loading");
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: profile.feeling, userProfile: profile })
            });
            if (!res.ok) throw new Error('Failed to fetch from AI');
            const data: AIResponse = await res.json();
            if (data.id) router.push(`/result/${data.id}`);
            else throw new Error("No ID returned from server");
        } catch (error) {
            console.error(error);
            alert("우주와 연결하는 도중 잠시 지연이 발생했습니다. 다시 시도해주세요.");
            setStep("feeling");
        }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.8, ease: "easeOut" as any }
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-[#FAF8F5] relative overflow-y-auto overflow-x-hidden p-6 font-sans selection:bg-[#E07A5F]/20">

            {/* ┌ Decorative Corner */}
            <div className="fixed top-8 left-8 w-8 h-8 pointer-events-none z-50">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-[#2A2A2A]"></div>
                <div className="absolute top-0 left-0 w-[1px] h-full bg-[#2A2A2A]"></div>
            </div>

            {/* ● Decorative Circle */}
            <div className="fixed top-12 right-10 w-14 h-14 bg-[#E07A5F] rounded-full pointer-events-none mix-blend-multiply opacity-80 z-50" />

            {/* Main Content Wrap */}
            <div className="w-full max-w-[420px] py-10 md:py-20 flex flex-col items-center min-h-screen">

                {/* 1. Header Area: 고립된 공간 확보 */}
                <header className="w-full text-center mb-16 flex-shrink-0">
                    <h1 className="text-[#E07A5F] text-[10px] md:text-xs font-bold tracking-[0.4em] mb-4 uppercase">Sense Your Day</h1>
                    <h2 className="text-[#2A2A2A] text-2xl md:text-3xl font-bold leading-snug tracking-tighter">
                        당신의 우주가 보내는<br />가장 사적인 한마디
                    </h2>
                </header>

                {/* 2. Form Content Area: flex-1로 공간 유연성 확보 */}
                <main className="w-full flex-1 flex flex-col items-center">
                    <AnimatePresence mode="wait">

                        {/* Step: Intro */}
                        {step === "intro" && (
                            <motion.div key="intro" {...fadeInUp} className="w-full flex flex-col items-center text-center space-y-16 py-4">
                                <p className="text-[#2A2A2A] text-sm md:text-base leading-loose whitespace-pre-line mt-4 font-medium opacity-80">
                                    당신의 탄생 정보와 오늘의 감각을 연결하여,<br />
                                    하루의 위로와 한 조각의 예술을 처방합니다.
                                </p>

                                <button
                                    onClick={handleNext}
                                    className="w-full max-w-[280px] py-4 border border-[#2A2A2A] text-[#E07A5F] text-lg font-bold hover:bg-[#2A2A2A] hover:text-[#FAF8F5] transition-all active:scale-95"
                                >
                                    시작하기
                                </button>
                            </motion.div>
                        )}

                        {/* Step: Name */}
                        {step === "name" && (
                            <motion.div key="name" {...fadeInUp} className="w-full flex flex-col items-center space-y-12">
                                <h3 className="text-[#2A2A2A] text-lg font-bold leading-relaxed mb-4 text-center">
                                    당신을 무엇이라고<br />부르면 좋을까요?
                                </h3>

                                <div className="w-full space-y-10">
                                    <div className="group w-full max-w-[320px] mx-auto">
                                        <p className="text-[10px] text-[#E07A5F] font-bold mb-2 text-center tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity uppercase">Your Name</p>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            placeholder="입력해주세요"
                                            className="w-full py-5 border-b border-[#2A2A2A] bg-transparent text-center text-[#2A2A2A] placeholder:text-[#2A2A2A]/10 outline-none focus:border-[#E07A5F] transition-all font-medium text-2xl tracking-tight"
                                            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                            autoFocus
                                        />
                                    </div>

                                    {profile.name && (
                                        <button
                                            onClick={handleNext}
                                            className="w-full py-5 border border-[#2A2A2A] text-[#E07A5F] text-lg font-bold hover:bg-[#2A2A2A] hover:text-[#FAF8F5] transition-all active:scale-95"
                                        >
                                            다음
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Step: Birth */}
                        {step === "birth" && (
                            <motion.div key="birth" {...fadeInUp} className="w-full flex flex-col items-center space-y-10">
                                <h3 className="text-[#2A2A2A] text-lg font-bold leading-relaxed mb-4 text-center">
                                    당신은 언제 이 세상에<br />도착했나요?
                                </h3>

                                <div className="w-full space-y-8">
                                    {/* Year Row */}
                                    <div className="group">
                                        <p className="text-[10px] text-[#E07A5F] font-bold mb-2 text-center tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity uppercase">YEAR</p>
                                        <input
                                            type="text" placeholder="YYYY" maxLength={4} inputMode="numeric"
                                            value={profile.birthDate.split('-')[0] || ''}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                const parts = profile.birthDate.split('-');
                                                setProfile({ ...profile, birthDate: `${val}-${parts[1] || ''}-${parts[2] || ''}` });
                                                if (val.length === 4) document.getElementById('month-input')?.focus();
                                            }}
                                            className="w-full py-5 border-b border-[#2A2A2A] bg-transparent text-center text-[#2A2A2A] placeholder:text-[#2A2A2A]/10 outline-none focus:border-[#E07A5F] transition-all font-medium text-2xl tracking-[0.3em]"
                                        />
                                    </div>

                                    {/* Month & Day Row */}
                                    <div className="flex gap-4">
                                        <div className="flex-1 group">
                                            <p className="text-[10px] text-[#E07A5F] font-bold mb-2 text-center tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity uppercase">MONTH</p>
                                            <input
                                                id="month-input" type="text" placeholder="MM" maxLength={2} inputMode="numeric"
                                                value={profile.birthDate.split('-')[1] || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    const parts = profile.birthDate.split('-');
                                                    setProfile({ ...profile, birthDate: `${parts[0] || ''}-${val}-${parts[2] || ''}` });
                                                    if (val.length === 2) document.getElementById('day-input')?.focus();
                                                }}
                                                className="w-full py-5 border-b border-[#2A2A2A] bg-transparent text-center text-[#2A2A2A] placeholder:text-[#2A2A2A]/10 outline-none focus:border-[#E07A5F] transition-all font-medium text-2xl tracking-[0.3em]"
                                            />
                                        </div>
                                        <div className="flex-1 group">
                                            <p className="text-[10px] text-[#E07A5F] font-bold mb-2 text-center tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity uppercase">DAY</p>
                                            <input
                                                id="day-input" type="text" placeholder="DD" maxLength={2} inputMode="numeric"
                                                value={profile.birthDate.split('-')[2] || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    const parts = profile.birthDate.split('-');
                                                    setProfile({ ...profile, birthDate: `${parts[0] || ''}-${parts[1] || ''}-${val}` });
                                                    if (val.length === 2 && !profile.birthTimeUnknown) document.getElementById('hour-input')?.focus();
                                                }}
                                                className="w-full py-5 border-b border-[#2A2A2A] bg-transparent text-center text-[#2A2A2A] placeholder:text-[#2A2A2A]/10 outline-none focus:border-[#E07A5F] transition-all font-medium text-2xl tracking-[0.3em]"
                                            />
                                        </div>
                                    </div>

                                    {/* Time Row */}
                                    <div className={`flex gap-4 transition-all ${profile.birthTimeUnknown ? 'opacity-10 grayscale pointer-events-none' : 'opacity-100'}`}>
                                        <div className="flex-1 group">
                                            <p className="text-[10px] text-[#E07A5F] font-bold mb-2 text-center tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity uppercase">HOUR</p>
                                            <input
                                                id="hour-input" type="text" placeholder="HH" maxLength={2} inputMode="numeric"
                                                value={profile.birthTime.split(':')[0] || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    const parts = profile.birthTime.split(':');
                                                    setProfile({ ...profile, birthTime: `${val}:${parts[1] || ''}` });
                                                    if (val.length === 2) document.getElementById('minute-input')?.focus();
                                                }}
                                                className="w-full py-5 border-b border-[#2A2A2A] bg-transparent text-center text-[#2A2A2A] placeholder:text-[#2A2A2A]/10 outline-none focus:border-[#E07A5F] transition-all font-medium text-2xl tracking-[0.3em]"
                                            />
                                        </div>
                                        <div className="flex-1 group">
                                            <p className="text-[10px] text-[#E07A5F] font-bold mb-2 text-center tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity uppercase">MIN</p>
                                            <input
                                                id="minute-input" type="text" placeholder="MM" maxLength={2} inputMode="numeric"
                                                value={profile.birthTime.split(':')[1] || ''}
                                                onChange={(e) => setProfile({ ...profile, birthTime: `${profile.birthTime.split(':')[0] || ''}:${e.target.value.replace(/\D/g, '')}` })}
                                                className="w-full py-5 border-b border-[#2A2A2A] bg-transparent text-center text-[#2A2A2A] placeholder:text-[#2A2A2A]/10 outline-none focus:border-[#E07A5F] transition-all font-medium text-2xl tracking-[0.3em]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="w-full pt-4 space-y-10 flex-shrink-0">
                                    <label className="flex items-center justify-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 border border-[#2A2A2A] flex items-center justify-center transition-all ${profile.birthTimeUnknown ? 'bg-[#2A2A2A]' : 'bg-transparent'}`}>
                                            {profile.birthTimeUnknown && <div className="w-1.5 h-1.5 bg-[#FAF8F5]" />}
                                        </div>
                                        <input type="checkbox" checked={profile.birthTimeUnknown || false} onChange={(e) => setProfile({ ...profile, birthTimeUnknown: e.target.checked })} className="hidden" />
                                        <span className="text-[11px] text-[#2A2A2A] font-bold tracking-widest opacity-60 group-hover:opacity-100 transition-opacity uppercase">I don't know my time</span>
                                    </label>

                                    <button
                                        onClick={handleNext}
                                        disabled={!profile.birthDate || (!profile.birthTime && !profile.birthTimeUnknown)}
                                        className="w-full py-5 border border-[#2A2A2A] text-[#E07A5F] text-lg font-bold hover:bg-[#2A2A2A] hover:text-[#FAF8F5] transition-all disabled:opacity-10 active:scale-95"
                                    >
                                        연결하기
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step: City */}
                        {step === "city" && (
                            <motion.div key="city" {...fadeInUp} className="w-full flex flex-col items-center space-y-12">
                                <h3 className="text-[#2A2A2A] text-lg font-bold leading-relaxed mb-4 text-center">
                                    태어난 도시를<br />알려주세요
                                </h3>

                                <div className="w-full space-y-10">
                                    <div className="group w-full max-w-[320px] mx-auto">
                                        <p className="text-[10px] text-[#E07A5F] font-bold mb-2 text-center tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity uppercase">Your City</p>
                                        <input
                                            type="text"
                                            value={profile.birthCity}
                                            onChange={(e) => setProfile({ ...profile, birthCity: e.target.value })}
                                            placeholder="예: 서울"
                                            className="w-full py-5 border-b border-[#2A2A2A] bg-transparent text-center text-[#2A2A2A] placeholder:text-[#2A2A2A]/10 outline-none focus:border-[#E07A5F] transition-all font-medium text-2xl tracking-tight"
                                            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                            autoFocus
                                        />
                                    </div>

                                    {profile.birthCity && (
                                        <button
                                            onClick={handleNext}
                                            className="w-full py-5 border border-[#2A2A2A] text-[#E07A5F] text-lg font-bold hover:bg-[#2A2A2A] hover:text-[#FAF8F5] transition-all active:scale-95"
                                        >
                                            다음
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Step: Feeling */}
                        {step === "feeling" && (
                            <motion.div key="feeling" {...fadeInUp} className="w-full flex flex-col items-center space-y-12">
                                <h3 className="text-[#2A2A2A] text-lg font-bold leading-relaxed mb-4 text-center">
                                    <span className="text-[#E07A5F]">{profile.name}</span>님,<br />
                                    오늘 하루, 당신의 기분은 어땠나요?
                                </h3>

                                <form onSubmit={handleSubmit} className="w-full space-y-10">
                                    <div className="group w-full max-w-[320px] mx-auto">
                                        <p className="text-[10px] text-[#E07A5F] font-bold mb-2 text-center tracking-widest opacity-0 group-focus-within:opacity-100 transition-opacity uppercase">Your Story</p>
                                        <input
                                            type="text"
                                            value={profile.feeling}
                                            onChange={(e) => setProfile({ ...profile, feeling: e.target.value })}
                                            placeholder="이야기를 적어주세요..."
                                            className="w-full py-5 border-b border-[#2A2A2A] bg-transparent text-center text-[#2A2A2A] placeholder:text-[#2A2A2A]/10 outline-none focus:border-[#E07A5F] transition-all font-medium text-2xl tracking-tight"
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!profile.feeling.trim()}
                                        className="w-full py-5 border border-[#2A2A2A] text-[#E07A5F] text-lg font-bold hover:bg-[#2A2A2A] hover:text-[#FAF8F5] disabled:opacity-10 active:scale-95 transition-all"
                                    >
                                        기록 남기기
                                        <Send className="w-4 h-4 inline ml-2" />
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* Step: Loading */}
                        {step === "loading" && (
                            <motion.div key="loading" {...fadeInUp} className="w-full flex flex-col items-center text-center space-y-8 py-20">
                                <div className="relative w-16 h-16">
                                    <div className="absolute inset-0 border-2 border-[#E07A5F]/20 rounded-full" />
                                    <div className="absolute inset-0 border-2 border-[#E07A5F] border-t-transparent rounded-full animate-spin" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[#E07A5F] text-xs font-bold tracking-[0.4em] uppercase animate-pulse">Processing</p>
                                    <p className="text-[#2A2A2A] font-medium tracking-widest">
                                        우주의 궤적을 해석하는 중...
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                {/* Footer */}
                <footer className="w-full text-center py-10 opacity-20 text-[10px] tracking-[0.2em] font-bold text-[#2A2A2A] flex-shrink-0">
                    © 2026 SENSE YOUR DAY
                </footer>
            </div>
        </div>
    );
}