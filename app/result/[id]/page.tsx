"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { GeneratorResult } from "@/lib/engine/generator";
import GeometricFrame from "@/components/GeometricFrame";
import ResultCard from "@/components/ResultCard";
import { Loader2 } from "lucide-react";

interface ResultData {
    id: number;
    user_profile: { name: string };
    analysis_result: GeneratorResult;
}

export default function ResultPage() {
    const params = useParams();
    const [data, setData] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            // Handle unwrapping params if it's a promise (Next.js 15+ compatible)
            // But primarily checking if ID exists in standard params object for now.
            const id = params?.id;
            if (!id) return;

            const { data: resultData, error } = await supabase
                .from('results')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error fetching result:", error);
            } else {
                setData(resultData);
            }
            setLoading(false);
        };

        fetchResult();
    }, [params]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#FAF8F5]">
                <Loader2 className="w-8 h-8 text-[#E07A5F] animate-spin" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#FAF8F5] text-[#2A2A2A] font-serif">
                <p>결과를 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center py-10 selection:bg-[#E07A5F]/20">
            <GeometricFrame>
                <ResultCard result={data.analysis_result} userName={data.user_profile.name} />
            </GeometricFrame>
        </main>
    );
}
