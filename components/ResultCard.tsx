"use client";

import { GeneratorResult } from "@/lib/engine/generator";
import { motion } from "framer-motion";
import { Quote, Music, Palette } from "lucide-react";

interface ResultCardProps {
    result: GeneratorResult;
    userName: string;
}

export default function ResultCard({ result, userName }: ResultCardProps) {
    return (
        <div className="flex flex-col items-center text-center space-y-12 font-serif text-[#2A2A2A]">

            {/* Header / Name */}
            <div className="space-y-4">
                <span className="text-xs font-sans tracking-[0.2em] text-[#E07A5F] uppercase">Analysis for</span>
                <h1 className="text-3xl tracking-wide">{userName}</h1>
                <div className="w-8 h-px bg-[#2A2A2A]/20 mx-auto mt-6"></div>
            </div>

            {/* Today's Advice (Crucial) */}
            <div className="space-y-6">
                <Quote className="w-6 h-6 text-[#E07A5F]/50 mx-auto" />
                <p className="text-lg leading-loose break-keep whitespace-pre-wrap">
                    {result.today_advice}
                </p>
                <div className="w-1 h-1 rounded-full bg-[#E07A5F] mx-auto"></div>
            </div>

            {/* Curious Question */}
            <div className="space-y-4 px-4 bg-[#2A2A2A]/5 py-8 rounded-sm mx-4">
                <span className="text-xs font-sans tracking-widest text-[#2A2A2A]/60">QUESTION</span>
                <p className="text-md leading-relaxed break-keep">
                    {result.curious_question}
                </p>
            </div>

            {/* Time Sense */}
            <div className="space-y-3">
                <span className="text-xs font-sans tracking-widest text-[#2A2A2A]/60">TIME SENSE</span>
                <p className="italic text-[#2A2A2A]/80 border-l-2 border-[#E07A5F] pl-4 text-left mx-8 text-sm">
                    "{result.time_sense}"
                </p>
            </div>

            {/* Art Curation (Gallery Style) */}
            <div className="w-full pt-8 border-t border-[#2A2A2A]/10 space-y-6">
                <div className="flex items-center justify-center space-x-2 text-[#E07A5F]">
                    <Palette className="w-4 h-4" />
                    <span className="text-xs font-sans tracking-[0.2em]">ART CURATION</span>
                </div>

                <div className="flex flex-col items-center space-y-4">
                    {/* Premium Color Swatch */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="group relative w-16 h-16 rounded-full shadow-lg transition-transform hover:scale-105"
                        style={{ backgroundColor: result.art_curation.color_code }}
                    >
                        {/* Inner Border for depth */}
                        <div className="absolute inset-0 rounded-full border border-white/20"></div>
                        {/* Outer Ring for Oatmeal contrast */}
                        <div className="absolute -inset-1 rounded-full border border-[#2A2A2A]/10"></div>
                    </motion.div>

                    <div className="space-y-1">
                        <h3 className="text-lg">{result.art_curation.title}</h3>
                        <p className="text-2xs font-sans text-[#2A2A2A]/50 tracking-widest">{result.art_curation.color_code.toUpperCase()}</p>
                    </div>

                    <p className="text-sm text-[#2A2A2A]/70 leading-relaxed max-w-xs mx-auto break-keep">
                        {result.art_curation.description}
                    </p>

                    {result.art_curation.music_recommendation && (
                        <div className="flex items-center space-x-2 text-xs text-[#2A2A2A]/60 pt-4">
                            <Music className="w-3 h-3" />
                            <span>{result.art_curation.music_recommendation}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Signature */}
            <div className="pt-12 pb-4 opacity-40">
                <p className="text-[0.6rem] font-sans tracking-[0.3em]">SENSE YOUR DAY</p>
            </div>

        </div>
    );
}
