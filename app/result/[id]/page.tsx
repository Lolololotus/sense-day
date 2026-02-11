import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ResultClient from "@/components/ResultClient";

// Force dynamic rendering since we are fetching data based on ID
export const dynamic = 'force-dynamic';

async function getResult(id: string) {
    const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null;
    return data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const data = await getResult(id);

    if (!data) {
        return {
            title: "Sense Your Day",
            description: "당신의 하루를 감각하세요."
        };
    }

    const { user_profile, analysis_result } = data;
    return {
        title: `${user_profile.name}님의 하루 - Sense Your Day`,
        description: `"${analysis_result.today_advice.substring(0, 60)}..."`,
        openGraph: {
            title: `${user_profile.name}님의 감각적인 하루`,
            description: analysis_result.today_advice,
            images: [
                {
                    url: '/tog-image.png',
                    width: 1200,
                    height: 630,
                }
            ]
        }
    };
}

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getResult(id);

    if (!data) {
        return notFound();
    }

    return <ResultClient data={data} />;
}
