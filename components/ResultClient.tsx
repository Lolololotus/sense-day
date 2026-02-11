"use client";

import { GeneratorResult } from "@/lib/engine/generator";
import GeometricFrame from "@/components/GeometricFrame";
import ResultCard from "@/components/ResultCard";

interface ResultData {
    id: number;
    user_profile: { name: string };
    analysis_result: GeneratorResult;
}

export default function ResultClient({ data }: { data: ResultData }) {
    if (!data) return null;

    return (
        <main className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center py-10 selection:bg-[#E07A5F]/20">
            <GeometricFrame>
                <ResultCard result={data.analysis_result} userName={data.user_profile.name} />
            </GeometricFrame>
        </main>
    );
}
