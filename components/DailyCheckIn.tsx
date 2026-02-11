"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, ChevronRight, Clock, MapPin, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ResultCardSkeleton from "./ResultCardSkeleton";
import Typewriter from "./Typewriter";

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
            // 1. Get AI Analysis
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: profile.feeling,
                    userProfile: profile
                })
            });

            if (!res.ok) throw new Error('Failed to fetch from AI');

            const data: AIResponse & { id?: number } = await res.json();

            // 2. Redirect to Result Page (Using ID from Server)
            if (data.id) {
                router.push(`/result/${data.id}`);
            } else {
                throw new Error("No ID returned from server");
            }

        } catch (error) {
            console.error(error);
            alert("우주와 연결하는 도중 잠시 지연이 발생했습니다. 다시 시도해주세요.");
            setStep("feeling"); // Retry
        }
    };

    // Helper for input animation
    const fadeInUp = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center min-h-[300px]">
            <AnimatePresence mode="wait">

                {/* Intro Step - Replaced by Landing Page Copy, jumping straight to action if needed, 
                    but keeping 'start' button for flow */}
                {step === "intro" && (
                    <motion.div key="intro" {...fadeInUp} className="text-center space-y-8">
                        {/* Geometric Line Element */}
                        <div className="flex justify-center items-center space-x-2 opacity-60">
                            <div className="w-12 h-px bg-[#E07A5F]"></div>
                            <div className="w-1 h-1 rounded-full bg-[#E07A5F]"></div>
                            <div className="w-12 h-px bg-[#E07A5F]"></div>
                        </div>

                        <button
                            onClick={handleNext}
                            className="group relative inline-flex items-center justify-center px-10 py-4 text-sm font-serif text-[#2A2A2A] transition-all bg-[#F2EEE6] border border-[#C8BEB4] hover:border-[#E07A5F] hover:text-[#E07A5F]"
                        >
                            <span className="tracking-widest mr-2">기록 시작하기</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                )}

                {/* Name Step */}
                {step === "name" && (
                    <motion.div key="name" {...fadeInUp} className="w-full max-w-[320px] space-y-10">
                        <h3 className="text-2xl font-serif text-[#2A2A2A] text-center leading-relaxed">
                            당신을<br />무엇이라 부르면 좋을까요?
                        </h3>
                        <div className="relative group">
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                placeholder="이름"
                                className="w-full py-3 text-center text-xl font-serif bg-transparent border-b border-[#C8BEB4] focus:border-[#E07A5F] outline-none transition-colors placeholder:text-[#C8BEB4] text-[#2A2A2A]"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                            />
                            {/* Geometric Accent Line */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#E07A5F] transition-all duration-500 group-focus-within:w-full"></div>
                        </div>
                        <button onClick={handleNext} disabled={!profile.name} className="w-full py-4 text-[#C8BEB4] hover:text-[#E07A5F] disabled:opacity-0 transition-all font-serif text-sm">
                            다음 <ChevronRight className="inline w-3 h-3 ml-1" />
                        </button>
                    </motion.div>
                )}

                {/* Birth Info Step: Segmented Input */}
                {step === "birth" && (
                    <motion.div key="birth" {...fadeInUp} className="w-full max-w-[320px] space-y-10">
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-serif text-[#2A2A2A] leading-relaxed">
                                당신이 세상에<br />도착한 시간
                            </h3>
                        </div>

                        <div className="space-y-8">
                            {/* Date Segments */}
                            <div className="flex justify-center items-end space-x-2 font-serif text-xl text-[#2A2A2A]">
                                <input
                                    type="text"
                                    placeholder="YYYY"
                                    maxLength={4}
                                    value={profile.birthDate.split('-')[0] || ''}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        const parts = profile.birthDate.split('-');
                                        const newDate = `${val}-${parts[1] || ''}-${parts[2] || ''}`;
                                        setProfile({ ...profile, birthDate: newDate });
                                        if (val.length === 4) document.getElementById('month-input')?.focus();
                                    }}
                                    className="w-16 py-2 text-center bg-transparent border-b border-[#C8BEB4] focus:border-[#2A2A2A] outline-none placeholder:text-[#C8BEB4]/50 transition-colors"
                                />
                                <span className="text-[#C8BEB4] pb-2">.</span>

                                <input
                                    id="month-input"
                                    type="text"
                                    placeholder="MM"
                                    maxLength={2}
                                    value={profile.birthDate.split('-')[1] || ''}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        const parts = profile.birthDate.split('-');
                                        const newDate = `${parts[0] || ''}-${val}-${parts[2] || ''}`;
                                        setProfile({ ...profile, birthDate: newDate });
                                        if (val.length === 2) document.getElementById('day-input')?.focus();
                                    }}
                                    className="w-10 py-2 text-center bg-transparent border-b border-[#C8BEB4] focus:border-[#2A2A2A] outline-none placeholder:text-[#C8BEB4]/50 transition-colors"
                                />
                                <span className="text-[#C8BEB4] pb-2">.</span>

                                <input
                                    id="day-input"
                                    type="text"
                                    placeholder="DD"
                                    maxLength={2}
                                    value={profile.birthDate.split('-')[2] || ''}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        const parts = profile.birthDate.split('-');
                                        const newDate = `${parts[0] || ''}-${parts[1] || ''}-${val}`;
                                        setProfile({ ...profile, birthDate: newDate });
                                        if (val.length === 2 && !profile.birthTimeUnknown) document.getElementById('hour-input')?.focus();
                                    }}
                                    className="w-10 py-2 text-center bg-transparent border-b border-[#C8BEB4] focus:border-[#2A2A2A] outline-none placeholder:text-[#C8BEB4]/50 transition-colors"
                                />
                            </div>

                            {/* Time Segments & Unknown Toggle */}
                            <div className="relative flex flex-col items-center space-y-4">
                                <div className={`flex justify-center items-end space-x-2 font-serif text-xl text-[#2A2A2A] transition-all duration-500 relative ${profile.birthTimeUnknown ? 'opacity-30 blur-[0.5px] pointer-events-none select-none' : 'opacity-100'}`}>
                                    <input
                                        id="hour-input"
                                        type="text"
                                        placeholder="HH"
                                        maxLength={2}
                                        value={profile.birthTime.split(':')[0] || ''}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            const parts = profile.birthTime.split(':');
                                            const newTime = `${val}:${parts[1] || ''}`;
                                            setProfile({ ...profile, birthTime: newTime });
                                            if (val.length === 2) document.getElementById('minute-input')?.focus();
                                        }}
                                        className="w-10 py-2 text-center bg-transparent border-b border-[#C8BEB4] focus:border-[#2A2A2A] outline-none placeholder:text-[#C8BEB4]/50 transition-colors"
                                        disabled={profile.birthTimeUnknown}
                                    />
                                    <span className="text-[#C8BEB4] pb-2">:</span>
                                    <input
                                        id="minute-input"
                                        type="text"
                                        placeholder="MM"
                                        maxLength={2}
                                        value={profile.birthTime.split(':')[1] || ''}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            const parts = profile.birthTime.split(':');
                                            const newTime = `${parts[0] || ''}:${val}`;
                                            setProfile({ ...profile, birthTime: newTime });
                                            if (val.length === 2) handleNext(); // Use Enter or click next manually
                                        }}
                                        className="w-10 py-2 text-center bg-transparent border-b border-[#C8BEB4] focus:border-[#2A2A2A] outline-none placeholder:text-[#C8BEB4]/50 transition-colors"
                                        disabled={profile.birthTimeUnknown}
                                    />

                                    {/* Geometric Strikethrough Line (Only visible when unknown) */}
                                    <div className={`absolute top-1/2 left-0 w-full h-px bg-[#C8BEB4] transition-transform duration-500 origin-left ${profile.birthTimeUnknown ? 'scale-x-100' : 'scale-x-0'}`}></div>
                                </div>

                                {/* Unknown Checkbox */}
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={profile.birthTimeUnknown || false}
                                        onChange={(e) => setProfile({ ...profile, birthTimeUnknown: e.target.checked })}
                                        className="hidden"
                                    />
                                    <div className={`w-3 h-3 border border-[#C8BEB4] transition-colors ${profile.birthTimeUnknown ? 'bg-[#C8BEB4]' : 'bg-transparent group-hover:border-[#E07A5F]'}`}></div>
                                    <span className={`text-xs font-serif tracking-widest transition-colors ${profile.birthTimeUnknown ? 'text-[#C8BEB4]' : 'text-[#C8BEB4] group-hover:text-[#E07A5F]'}`}>
                                        시간을 모릅니다
                                    </span>
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={!profile.birthDate || (!profile.birthTime && !profile.birthTimeUnknown)}
                            className="w-full py-4 text-[#C8BEB4] hover:text-[#E07A5F] disabled:opacity-0 transition-all font-serif text-sm"
                        >
                            다음 <ChevronRight className="inline w-3 h-3 ml-1" />
                        </button>
                    </motion.div>
                )}

                {/* City Step */}
                {step === "city" && (
                    <motion.div key="city" {...fadeInUp} className="w-full max-w-[320px] space-y-10">
                        <h3 className="text-2xl font-serif text-[#2A2A2A] text-center leading-relaxed">
                            태어난 도시
                        </h3>
                        <div className="relative group">
                            <input
                                type="text"
                                value={profile.birthCity}
                                onChange={(e) => setProfile({ ...profile, birthCity: e.target.value })}
                                placeholder="예: 서울"
                                className="w-full py-3 text-center text-xl font-serif bg-transparent border-b border-[#C8BEB4] focus:border-[#E07A5F] outline-none transition-colors placeholder:text-[#C8BEB4] text-[#2A2A2A]"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                            />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#E07A5F] transition-all duration-500 group-focus-within:w-full"></div>
                        </div>
                        <button onClick={handleNext} disabled={!profile.birthCity} className="w-full py-4 text-[#C8BEB4] hover:text-[#E07A5F] disabled:opacity-0 transition-all font-serif text-sm">
                            다음 <ChevronRight className="inline w-3 h-3 ml-1" />
                        </button>
                    </motion.div>
                )}

                {/* Feeling Step (Final Input) */}
                {step === "feeling" && (
                    <motion.div key="feeling" {...fadeInUp} className="w-full max-w-[400px] text-center space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-serif text-[#2A2A2A] leading-relaxed">
                                <span className="text-[#E07A5F]">{profile.name}</span>님,<br />오늘의 파도는 어땠나요?
                            </h2>
                            <p className="text-xs text-[#3C3C3C]/60 font-sans tracking-wide">사소한 감정도, 깊은 고민도 좋습니다.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="relative w-full">
                            <input
                                type="text"
                                value={profile.feeling}
                                onChange={(e) => setProfile({ ...profile, feeling: e.target.value })}
                                placeholder="이야기를 적어주세요..."
                                className="w-full py-4 px-2 text-lg font-serif bg-transparent border-b border-[#C8BEB4] focus:border-[#E07A5F] outline-none transition-colors placeholder:text-[#C8BEB4] text-[#2A2A2A] text-center"
                                autoFocus
                            />

                            <div className="mt-8">
                                <button
                                    type="submit"
                                    disabled={!profile.feeling.trim()}
                                    className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-serif text-[#2A2A2A] transition-all disabled:opacity-0 hover:text-[#E07A5F]"
                                >
                                    <span className="tracking-widest mr-2">기록 남기기</span>
                                    <Send className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Loading Step */}
                {step === "loading" && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full flex flex-col items-center space-y-8"
                    >
                        <div className="flex flex-col items-center space-y-4">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="w-12 h-12 border border-[#C8BEB4] border-t-[#E07A5F] rounded-full"
                            />
                            <p className="text-sm font-serif text-[#3C3C3C] tracking-widest animate-pulse">
                                별들의 문장을 해석하는 중...
                            </p>
                        </div>

                        <motion.div
                            layoutId="user-input"
                            className="p-6 bg-[#F2EEE6] border border-[#C8BEB4] text-[#2A2A2A] max-w-sm text-center w-full font-serif text-sm leading-relaxed"
                        >
                            <div className="mb-4 flex justify-center">
                                <Sparkles className="w-4 h-4 text-[#E07A5F]" />
                            </div>
                            "{profile.feeling}"
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
