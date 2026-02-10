
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Share2, ArrowLeft, Calendar, Download } from 'lucide-react';
import Typewriter from '@/components/Typewriter';
import GeometricIcon from '@/components/GeometricIcon';
import MintButton from '@/components/MintButton';
import { supabase } from '@/lib/supabase';

// Helper to format date as "2026. 02. 10. (Tue)"
function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short'
    }).format(date);
}

// Get day number for "Calendar" look
function getDayNumber(dateString: string) {
    return new Date(dateString).getDate();
}

async function getResult(id: string) {
    const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null;
    return data;
}

export default async function ResultPage({ params }: { params: { id: string } }) {
    const resultData = await getResult(params.id);

    if (!resultData) {
        return notFound();
    }

    const { user_profile, analysis_result, created_at } = resultData;
    const { art_curation } = analysis_result;

    // Muted Tone Background
    const backgroundStyle = {
        backgroundColor: art_curation.color_code, // Main muted tone
        color: '#1e293b' // Slate-800 for text on paper
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 transition-colors duration-1000"
            style={{ background: `linear-gradient(135deg, ${art_curation.color_code} 0%, #0f172a 100%)` }}>

            {/* Main "Calendar Page" Container */}
            <main className="w-full max-w-3xl bg-[#FDFCF8] rounded-sm shadow-2xl overflow-hidden relative flex flex-col md:min-h-[800px] animate-in fade-in slide-in-from-bottom-12 duration-1000">

                {/* Paper Texture Overlay (Optional, CSS only) */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }}>
                </div>

                {/* Header: Date & Nav */}
                <header className="p-8 border-b border-stone-200 flex justify-between items-start">
                    <div>
                        <Link href="/" className="group flex items-center text-xs uppercase tracking-widest text-stone-400 hover:text-stone-600 transition-colors mb-2">
                            <ArrowLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
                            Sense Your Day
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-serif text-stone-900 font-bold tracking-tighter">
                            {getDayNumber(created_at)}
                        </h1>
                        <p className="text-stone-500 font-serif italic mt-1">{formatDate(created_at)}</p>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-400">
                            {/* Element Icon */}
                            <GeometricIcon type={art_curation.missingElement} color={art_curation.color_code} className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-stone-400 mt-2 text-right">
                            Missing: {art_curation.keyword}
                        </span>
                    </div>
                </header>

                {/* Content Body */}
                <div className="flex-1 p-8 md:p-12 flex flex-col gap-12">

                    {/* 1. The Poetic Insight */}
                    <section className="text-center space-y-6">
                        <p className="text-sm font-medium text-stone-400 uppercase tracking-widest">{user_profile.name}님의 문장</p>
                        <h2 className="text-2xl md:text-3xl font-serif text-stone-800 leading-relaxed keep-all">
                            <Typewriter text={analysis_result.today_advice} speed={40} />
                        </h2>
                    </section>

                    {/* 2. Three-Columns: Question / Time / Action */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm border-t border-b border-stone-100 py-8">
                        <div className="space-y-2">
                            <span className="text-[10px] uppercase tracking-widest text-rose-400 font-bold block mb-1">Question</span>
                            <p className="text-stone-600 leading-relaxed keep-all">{analysis_result.curious_question}</p>
                        </div>
                        <div className="space-y-2 md:border-l md:border-r border-stone-100 md:px-6">
                            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block mb-1">Time Sense</span>
                            <p className="text-stone-600 leading-relaxed keep-all">{analysis_result.time_sense}</p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold block mb-1">Action</span>
                            <p className="text-stone-600 leading-relaxed keep-all">{analysis_result.action_guide}</p>
                        </div>
                    </section>

                    {/* 3. Total Arts Remedy - Poster Style */}
                    <section className="relative group cursor-default">
                        <div className="absolute inset-0 bg-stone-900 transform translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2 rounded-sm"></div>
                        <div className="relative bg-white border border-stone-200 p-6 rounded-sm flex flex-col md:flex-row gap-6 items-center">

                            {/* "Art" Placeholder/Image */}
                            <div className="w-full md:w-1/3 aspect-[3/4] bg-stone-100 flex items-center justify-center relative overflow-hidden"
                                style={{ backgroundColor: `${art_curation.color_code}20` }}>
                                <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ backgroundColor: art_curation.color_code }}></div>
                                <span className="text-4xl">🎨</span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: art_curation.color_code }}>Total Arts Remedy</span>
                                    <h3 className="text-xl md:text-2xl font-serif text-stone-900 mt-1">{art_curation.title}</h3>
                                </div>
                                <p className="text-stone-500 text-sm leading-relaxed">{art_curation.description}</p>

                                <div className="pt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
                                        🎵 {art_curation.musicTempo}
                                    </span>
                                    {art_curation.music_recommendation && (
                                        <span className="px-3 py-1 rounded-full border border-stone-200 text-stone-500 text-xs">
                                            Recommended: {art_curation.music_recommendation}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <footer className="bg-stone-50 p-6 flex justify-between items-center text-xs text-stone-400">
                    <span>Sense Your Day © 2026</span>
                    <div className="flex gap-4 items-center">
                        <MintButton resultId={params.id} colorCode={art_curation.color_code} />
                        <button className="flex items-center hover:text-stone-600 transition-colors">
                            <Share2 className="w-4 h-4 mr-1" /> Share
                        </button>
                    </div>
                </footer>

            </main>
        </div>
    );
}
