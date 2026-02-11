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
    // Simplified steps to match design flow
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

    // Shared Header Component
    const CheckInHeader = () => (
        <div className="absolute top-0 left-0 w-full flex flex-col items-center pt-16 z-20 pointer-events-none">
            <h1 className="text-[#E07A5F] text-xs font-bold tracking-[0.2em] mb-4">SENSE YOUR DAY</h1>
            <h2 className="text-[#2A2A2A] text-2xl md:text-3xl font-serif font-bold text-center leading-tight">
                당신의 우주가 보내는<br />
                가장 사적인 한마디
            </h2>
        </div>
    );

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] relative overflow-hidden p-6">

            {/* Top Left Geometric Corner (Inverted L) */}
            <div className="absolute top-8 left-8 w-8 h-8 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-[#2A2A2A]"></div>
                <div className="absolute top-0 left-0 w-[1px] h-full bg-[#2A2A2A]"></div>
            </div>

            {/* Top Right Orange Circle */}
            <div className="absolute top-24 right-0 w-16 h-16 bg-[#F05D23] rounded-full translate-x-1/2 pointer-events-none" />

            <div className="relative w-full max-w-[420px] min-h-[500px] flex flex-col items-center">
                {/* Persistent Header for these steps */}
                <CheckInHeader />

                <div className="flex-1 w-full flex flex-col justify-center mt-32">
                    <AnimatePresence mode="wait">
                        {/* Intro Step */}
                        {step === "intro" && (
                            <motion.div key="intro" {...fadeInUp} className="w-full flex flex-col items-center text-center space-y-16">
                                <p className="text-[#2A2A2A] text-sm md:text-base font-serif leading-loose whitespace-pre-line mt-8">
                                    당신의 탄생 정보와 오늘의 감각을 연결하여,<br />
                                    하루의 위로와 한 조각의 예술을 처방합니다.
                                </p>

                                <button
                                    onClick={handleNext}
                                    className="w-full py-4 border border-[#2A2A2A] text-[#E07A5F] text-lg hover:bg-[#2A2A2A] hover:text-[#FAF8F5] transition-colors"
                                >
                                    시작하기
                                </button>
                            </motion.div>
                        )}

                        {/* Name Step */}
                        {step === "name" && (
                            <motion.div key="name" {...fadeInUp} className="w-full flex flex-col items-center text-center space-y-12">
                                <h3 className="text-[#2A2A2A] text-lg font-medium leading-relaxed mt-8">
                                    당신을 무엇이라고<br />
                                    부르면 좋을까요?
                                </h3>

                                <div className="w-full space-y-8">
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        placeholder="입력해주세요"
                                        className="w-full py-4 border border-[#2A2A2A] bg-transparent text-center text-[#E07A5F] placeholder:text-[#E07A5F]/40 outline-none focus:bg-white/50 transition-colors"
                                        onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                        autoFocus
                                    />

                                    {profile.name && (
                                        <button
                                            onClick={handleNext}
                                            className="w-full py-4 border border-[#E07A5F] bg-[#E07A5F] text-white hover:bg-[#D06A4F] transition-colors"
                                        >
                                            다음
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Birth Step */}
                        {step === "birth" && (
                            <motion.div key="birth" {...fadeInUp} className="w-full flex flex-col items-center text-center space-y-8">
                                <h3 className="text-[#2A2A2A] text-lg font-medium leading-relaxed mt-4">
                                    당신은 언제 이 세상에<br />
                                    도착했나요?
                                </h3>

                                <div className="w-full flex flex-col gap-3">
                                    {/* Year Input */}
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
                                            if (val.length === 4) document.getElementById('month-day-input')?.focus();
                                        }}
                                        className="w-full py-3 border border-[#2A2A2A] bg-transparent text-center text-[#E07A5F] placeholder:text-[#E07A5F]/40 outline-none focus:bg-white/50 transition-colors"
                                    />

                                    {/* MM-DD Input (Visualized as one box but handled logically) */}
                                    {/* Using a flex container to mimic the single box look or just two inputs side by side? 
                                        The design shows [ MM-DD ] as one block. Let's make it a single input that handles masking or 2 inputs in a container.
                                        For simplicity and mobile UX, a container with 2 inputs is safer. */}
                                    <div className="w-full flex border border-[#2A2A2A] bg-transparent focus-within:bg-white/50 transition-colors">
                                        <input
                                            id="month-day-input"
                                            type="text"
                                            placeholder="MM"
                                            maxLength={2}
                                            inputMode="numeric"
                                            className="flex-1 py-3 text-center bg-transparent text-[#E07A5F] placeholder:text-[#E07A5F]/40 outline-none"
                                            value={profile.birthDate.split('-')[1] || ''}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                const parts = profile.birthDate.split('-');
                                                const newDate = `${parts[0] || ''}-${val}-${parts[2] || ''}`;
                                                setProfile({ ...profile, birthDate: newDate });
                                                if (val.length === 2) document.getElementById('day-part-input')?.focus();
                                            }}
                                        />
                                        <span className="py-3 text-[#2A2A2A]">-</span>
                                        <input
                                            id="day-part-input"
                                            type="text"
                                            placeholder="DD"
                                            maxLength={2}
                                            inputMode="numeric"
                                            className="flex-1 py-3 text-center bg-transparent text-[#E07A5F] placeholder:text-[#E07A5F]/40 outline-none"
                                            value={profile.birthDate.split('-')[2] || ''}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                const parts = profile.birthDate.split('-');
                                                const newDate = `${parts[0] || ''}-${parts[1] || ''}-${val}`;
                                                setProfile({ ...profile, birthDate: newDate });
                                                if (val.length === 2 && !profile.birthTimeUnknown) document.getElementById('time-input')?.focus();
                                            }}
                                        />
                                    </div>

                                    {/* HH-MM Input */}
                                    <div className={`w-full flex border border-[#2A2A2A] bg-transparent focus-within:bg-white/50 transition-all ${profile.birthTimeUnknown ? 'opacity-30 pointer-events-none bg-gray-100' : ''}`}>
                                        <input
                                            id="time-input"
                                            type="text"
                                            placeholder="HH"
                                            maxLength={2}
                                            inputMode="numeric"
                                            className="flex-1 py-3 text-center bg-transparent text-[#E07A5F] placeholder:text-[#E07A5F]/40 outline-none"
                                            value={profile.birthTime.split(':')[0] || ''}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                const parts = profile.birthTime.split(':');
                                                const newTime = `${val}:${parts[1] || ''}`;
                                                setProfile({ ...profile, birthTime: newTime });
                                                if (val.length === 2) document.getElementById('minute-part-input')?.focus();
                                            }}
                                            disabled={profile.birthTimeUnknown}
                                        />
                                        <span className="py-3 text-[#2A2A2A]">-</span>
                                        <input
                                            id="minute-part-input"
                                            type="text"
                                            placeholder="MM"
                                            maxLength={2}
                                            inputMode="numeric"
                                            className="flex-1 py-3 text-center bg-transparent text-[#E07A5F] placeholder:text-[#E07A5F]/40 outline-none"
                                            value={profile.birthTime.split(':')[1] || ''}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                const parts = profile.birthTime.split(':');
                                                const newTime = `${parts[0] || ''}:${val}`;
                                                setProfile({ ...profile, birthTime: newTime });
                                            }}
                                            disabled={profile.birthTimeUnknown}
                                        />
                                    </div>

                                    {/* Unknown Checkbox */}
                                    <label className="flex items-center justify-center gap-2 cursor-pointer group mt-2 mb-4">
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

                                    <button
                                        onClick={handleNext}
                                        disabled={!profile.birthDate || (!profile.birthTime && !profile.birthTimeUnknown)}
                                        className="w-full py-4 border border-[#2A2A2A] text-[#E07A5F] text-lg hover:bg-[#2A2A2A] hover:text-[#FAF8F5] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#E07A5F] transition-all"
                                    >
                                        연결하기
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* City Step (Styling matched to Name step for consistency) */}
                        {step === "city" && (
                            <motion.div key="city" {...fadeInUp} className="w-full flex flex-col items-center text-center space-y-12">
                                <h3 className="text-[#2A2A2A] text-lg font-medium leading-relaxed mt-8">
                                    태어난 도시를<br />
                                    알려주세요
                                </h3>

                                <div className="w-full space-y-8">
                                    <input
                                        type="text"
                                        value={profile.birthCity}
                                        onChange={(e) => setProfile({ ...profile, birthCity: e.target.value })}
                                        placeholder="예: 서울"
                                        className="w-full py-4 border border-[#2A2A2A] bg-transparent text-center text-[#E07A5F] placeholder:text-[#E07A5F]/40 outline-none focus:bg-white/50 transition-colors"
                                        onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                        autoFocus
                                    />

                                    {profile.birthCity && (
                                        <button
                                            onClick={handleNext}
                                            className="w-full py-4 border border-[#E07A5F] bg-[#E07A5F] text-white hover:bg-[#D06A4F] transition-colors"
                                        >
                                            다음
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Feeling Step */}
                        {step === "feeling" && (
                            <motion.div key="feeling" {...fadeInUp} className="w-full flex flex-col items-center text-center space-y-12">
                                <h2 className="text-[#2A2A2A] text-lg font-medium leading-relaxed mt-8">
                                    <span className="text-[#E07A5F] font-bold">{profile.name}</span>님,<br />
                                    오늘의 파도는 어땠나요?
                                </h2>

                                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-8">
                                    <input
                                        type="text"
                                        value={profile.feeling}
                                        onChange={(e) => setProfile({ ...profile, feeling: e.target.value })}
                                        placeholder="이야기를 적어주세요..."
                                        className="w-full py-4 border border-[#2A2A2A] bg-transparent text-center text-[#E07A5F] placeholder:text-[#E07A5F]/40 outline-none focus:bg-white/50 transition-colors"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        disabled={!profile.feeling.trim()}
                                        className="w-full py-4 border border-[#2A2A2A] text-[#E07A5F] text-lg hover:bg-[#2A2A2A] hover:text-[#FAF8F5] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#E07A5F] transition-all"
                                    >
                                        <span className="mr-2">기록 남기기</span>
                                        <Send className="w-4 h-4 inline" />
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* Loading Step */}
                        {step === "loading" && (
                            <motion.div key="loading" {...fadeInUp} className="w-full flex flex-col items-center text-center space-y-8 mt-20">
                                <div className="w-12 h-12 border-2 border-[#E07A5F] border-t-transparent rounded-full animate-spin" />
                                <p className="text-[#E07A5F] animate-pulse">
                                    별들의 문장을 해석하는 중...
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
