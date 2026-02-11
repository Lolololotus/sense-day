"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronRight } from "lucide-react";
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
                body: JSON.stringify({
                    message: profile.feeling,
                    userProfile: profile
                })
            });

            if (!res.ok) throw new Error('Failed to fetch from AI');
            const data: AIResponse = await res.json();

            if (data.id) {
                router.push(`/result/${data.id}`);
            } else {
                throw new Error("No ID returned from server");
            }
        } catch (error) {
            console.error(error);
            alert("우주와 연결하는 도중 잠시 지연이 발생했습니다. 다시 시도해주세요.");
            setStep("feeling");
        }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-4">
            {/* Centered Card Container */}
            <div className="relative w-full max-w-[480px] min-h-[600px] flex flex-col items-center justify-center">

                {/* Geometric Accents */}
                {/* Top Left: Thin Dark Inverted-L */}
                <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-[#2A2A2A]"></div>
                    <div className="absolute top-0 left-0 w-[1px] h-full bg-[#2A2A2A]"></div>
                </div>

                {/* Top Right: Orange Circle (Only visible in Intro or fixed?) 
                    Requirements say "Top-right (next to title) solid orange circle". 
                    Since title changes per step, we act as a static frame or move it with content.
                    Let's keep it static relative to the container for stability. */}
                <div className="absolute top-10 right-0 w-16 h-16 bg-[#E07A5F] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                <AnimatePresence mode="wait">
                    {/* Intro Step */}
                    {step === "intro" && (
                        <motion.div key="intro" {...fadeInUp} className="text-center space-y-12 z-10 w-full">
                            <div className="space-y-4">
                                <h1 className="text-sm text-[#E07A5F] tracking-[0.2em] font-bold">SENSE YOUR DAY</h1>
                                <h2 className="text-3xl text-[#2A2A2A] leading-tight font-semibold">
                                    당신의 우주가 보내는<br />
                                    가장 사적인 한마디
                                </h2>
                            </div>

                            <button
                                onClick={handleNext}
                                className="group inline-flex items-center justify-center px-12 py-4 text-base font-semibold text-[#E07A5F] border border-[#E07A5F] transition-all hover:bg-[#E07A5F] hover:text-white"
                            >
                                <span className="tracking-widest mr-2">시작하기</span>
                            </button>
                        </motion.div>
                    )}

                    {/* Name Step */}
                    {step === "name" && (
                        <motion.div key="name" {...fadeInUp} className="w-full text-center space-y-16 z-10">
                            <h3 className="text-2xl text-[#2A2A2A] leading-relaxed font-semibold">
                                당신을 무엇이라고<br />부르면 좋을까요?
                            </h3>

                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                placeholder="입력해주세요"
                                className="w-full max-w-[280px] py-3 text-center text-xl bg-transparent border-b border-[#C8BEB4] focus:border-[#E07A5F] outline-none placeholder:text-[#E07A5F]/50 text-[#2A2A2A] transition-colors"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                            />

                            {profile.name && (
                                <button onClick={handleNext} className="mt-8 px-10 py-3 border border-[#E07A5F] text-[#E07A5F] hover:bg-[#E07A5F] hover:text-white transition-all text-sm font-semibold">
                                    다음
                                </button>
                            )}
                        </motion.div>
                    )}

                    {/* Birth Step */}
                    {step === "birth" && (
                        <motion.div key="birth" {...fadeInUp} className="w-full text-center space-y-12 z-10">
                            <h3 className="text-2xl text-[#2A2A2A] leading-relaxed font-semibold">
                                당신은 언제 이 세상에<br />도착했나요?
                            </h3>

                            <div className="flex flex-col items-center gap-8 w-full">
                                {/* Date Input Row */}
                                <div className="flex items-center gap-4 text-xl text-[#2A2A2A]">
                                    <input
                                        type="text"
                                        placeholder="YYYY"
                                        maxLength={4}
                                        inputMode="numeric"
                                        value={profile.birthDate.split('-')[0] || ''}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            const parts = profile.birthDate.split('-');
                                            const newDate = `${val}-${parts[1] || ''}-${parts[2] || ''}`;
                                            setProfile({ ...profile, birthDate: newDate });
                                            if (val.length === 4) document.getElementById('month-input')?.focus();
                                        }}
                                        className="w-24 py-2 text-center bg-transparent border-b border-[#2A2A2A] focus:border-[#E07A5F] outline-none placeholder:text-[#E07A5F]/40"
                                    />
                                    <div className="flex gap-4">
                                        <input
                                            id="month-input"
                                            type="text"
                                            placeholder="MM"
                                            maxLength={2}
                                            inputMode="numeric"
                                            value={profile.birthDate.split('-')[1] || ''}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                const parts = profile.birthDate.split('-');
                                                const newDate = `${parts[0] || ''}-${val}-${parts[2] || ''}`;
                                                setProfile({ ...profile, birthDate: newDate });
                                                if (val.length === 2) document.getElementById('day-input')?.focus();
                                            }}
                                            className="w-16 py-2 text-center bg-transparent border-b border-[#2A2A2A] focus:border-[#E07A5F] outline-none placeholder:text-[#E07A5F]/40"
                                        />
                                        <input
                                            id="day-input"
                                            type="text"
                                            placeholder="DD"
                                            maxLength={2}
                                            inputMode="numeric"
                                            value={profile.birthDate.split('-')[2] || ''}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                const parts = profile.birthDate.split('-');
                                                const newDate = `${parts[0] || ''}-${parts[1] || ''}-${val}`;
                                                setProfile({ ...profile, birthDate: newDate });
                                                if (val.length === 2 && !profile.birthTimeUnknown) document.getElementById('hour-input')?.focus();
                                            }}
                                            className="w-16 py-2 text-center bg-transparent border-b border-[#2A2A2A] focus:border-[#E07A5F] outline-none placeholder:text-[#E07A5F]/40"
                                        />
                                    </div>
                                </div>

                                {/* Time Input Row */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className={`flex items-center gap-2 transition-opacity duration-300 ${profile.birthTimeUnknown ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                                        <input
                                            id="hour-input"
                                            type="text"
                                            placeholder="HH"
                                            maxLength={2}
                                            inputMode="numeric"
                                            value={profile.birthTime.split(':')[0] || ''}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                const parts = profile.birthTime.split(':');
                                                const newTime = `${val}:${parts[1] || ''}`;
                                                setProfile({ ...profile, birthTime: newTime });
                                                if (val.length === 2) document.getElementById('minute-input')?.focus();
                                            }}
                                            className="w-20 py-2 text-center text-xl bg-transparent border-b border-[#2A2A2A] focus:border-[#E07A5F] outline-none placeholder:text-[#E07A5F]/40"
                                            disabled={profile.birthTimeUnknown}
                                        />
                                        <span className="text-[#2A2A2A] pb-1 font-bold text-xl">:</span>
                                        <input
                                            id="minute-input"
                                            type="text"
                                            placeholder="MM"
                                            maxLength={2}
                                            inputMode="numeric"
                                            value={profile.birthTime.split(':')[1] || ''}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                const parts = profile.birthTime.split(':');
                                                const newTime = `${parts[0] || ''}:${val}`;
                                                setProfile({ ...profile, birthTime: newTime });
                                            }}
                                            className="w-20 py-2 text-center text-xl bg-transparent border-b border-[#2A2A2A] focus:border-[#E07A5F] outline-none placeholder:text-[#E07A5F]/40"
                                            disabled={profile.birthTimeUnknown}
                                        />
                                    </div>

                                    {/* Unknown Checkbox - Styled as per request */}
                                    <label className="flex items-center gap-2 cursor-pointer group mt-2">
                                        <div className={`w-4 h-4 border border-[#E07A5F] flex items-center justify-center transition-colors ${profile.birthTimeUnknown ? 'bg-[#E07A5F]' : 'bg-transparent'}`}>
                                            {profile.birthTimeUnknown && <div className="w-2 h-2 bg-white" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={profile.birthTimeUnknown || false}
                                            onChange={(e) => setProfile({ ...profile, birthTimeUnknown: e.target.checked })}
                                            className="hidden"
                                        />
                                        <span className="text-sm text-[#E07A5F]">시간을 모릅니다.</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-8">
                                <button
                                    onClick={handleNext}
                                    disabled={!profile.birthDate || (!profile.birthTime && !profile.birthTimeUnknown)}
                                    className="px-12 py-4 border border-[#E07A5F] text-[#E07A5F] hover:bg-[#E07A5F] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#E07A5F] transition-all text-base font-semibold"
                                >
                                    연결하기
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* City Step */}
                    {step === "city" && (
                        <motion.div key="city" {...fadeInUp} className="w-full text-center space-y-16 z-10">
                            <h3 className="text-2xl text-[#2A2A2A] leading-relaxed font-semibold">
                                태어난 도시를<br />알려주세요
                            </h3>
                            <input
                                type="text"
                                value={profile.birthCity}
                                onChange={(e) => setProfile({ ...profile, birthCity: e.target.value })}
                                placeholder="예: 서울"
                                className="w-full max-w-[280px] py-3 text-center text-xl bg-transparent border-b border-[#C8BEB4] focus:border-[#E07A5F] outline-none placeholder:text-[#E07A5F]/50 text-[#2A2A2A] transition-colors"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                            />
                            {profile.birthCity && (
                                <button onClick={handleNext} className="mt-8 px-10 py-3 border border-[#E07A5F] text-[#E07A5F] hover:bg-[#E07A5F] hover:text-white transition-all text-sm font-semibold">
                                    다음
                                </button>
                            )}
                        </motion.div>
                    )}

                    {/* Feeling Step */}
                    {step === "feeling" && (
                        <motion.div key="feeling" {...fadeInUp} className="w-full text-center space-y-12 z-10">
                            <h2 className="text-2xl text-[#2A2A2A] leading-relaxed font-semibold">
                                <span className="text-[#E07A5F]">{profile.name}</span>님,<br />오늘의 파도는 어땠나요?
                            </h2>

                            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-12">
                                <input
                                    type="text"
                                    value={profile.feeling}
                                    onChange={(e) => setProfile({ ...profile, feeling: e.target.value })}
                                    placeholder="이야기를 적어주세요..."
                                    className="w-full max-w-[320px] py-3 text-center text-lg bg-transparent border-b border-[#C8BEB4] focus:border-[#E07A5F] outline-none placeholder:text-[#E07A5F]/50 text-[#2A2A2A] transition-colors"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!profile.feeling.trim()}
                                    className="px-12 py-4 border border-[#E07A5F] text-[#E07A5F] hover:bg-[#E07A5F] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#E07A5F] transition-all text-base font-semibold"
                                >
                                    <span className="mr-2">기록 남기기</span>
                                    <Send className="w-4 h-4 inline" />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
