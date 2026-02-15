import { NextResponse } from "next/server";
import { generatePoeticInsight, UserContext } from "@/lib/engine/generator";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getRemedyContext } from "@/lib/astrology";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, userProfile } = body;

        // 1. Parse User Profile & Calculate Destiny Data
        const birthDate = userProfile?.birthDate ? new Date(userProfile.birthDate) : new Date("2000-01-01");

        // Handle Time: Use provided time or default to 12:00 if unknown/missing
        if (userProfile?.birthTime && !userProfile?.birthTimeUnknown) {
            const [hours, minutes] = userProfile.birthTime.split(':');
            birthDate.setHours(parseInt(hours), parseInt(minutes));
        } else {
            birthDate.setHours(12, 0); // Default to Noon (Horse Hour) - standard for unknown time
        }

        // 2. Run Hybrid Engine (Saju + Astrology)
        const remedyContext = await getRemedyContext(birthDate);

        // 3. Construct UserContext with Hard Data
        const context: UserContext = {
            name: userProfile?.name || "Traveler",
            birthDate: userProfile?.birthDate || "2000-01-01",
            birthTime: userProfile?.birthTime || "12:00",
            birthCity: userProfile?.birthCity || "Seoul",
            birthTimeUnknown: userProfile?.birthTimeUnknown,
            feeling: message,
            // Inject calculated data
            sajuElements: remedyContext.missingElements,
            cosmicWeather: remedyContext.cosmicWeather,
            recommendedColor: remedyContext.recommendedColor,
            dominantPlanet: remedyContext.dominantPlanets[0],
            remedySchema: remedyContext.remedySchema,
            energyScore: remedyContext.energyScore,
            dayMaster: remedyContext.dayMaster
        };

        // 4. Generate Insight via Gemini
        const aiResponse = await generatePoeticInsight(context);

        // 5. Append Art Curation Data (Derived from RemedyContext) relative to AI's output
        const finalResponse = {
            ...aiResponse,
            art_curation: {
                ...aiResponse.art_curation, // AI generated title/desc
                color_code: remedyContext.recommendedColor, // Engine enforced color
                missingElement: remedyContext.missingElements[0] || "Fire", // Engine enforced element
                keyword: remedyContext.remedySchema.keyword // Engine enforced keyword
            }
        };

        // 6. Save to Supabase (SERVER SIDE SECURE WRITE)
        let insertedId = null;
        try {
            const { data, error } = await supabaseAdmin
                .from('results')
                .insert({
                    user_profile: context,
                    analysis_result: finalResponse
                    // is_minted defaults to false
                })
                .select('id')
                .single();

            if (error) throw error;
            insertedId = data.id;

        } catch (dbError) {
            console.error("DB Save failed", dbError);
            // We might still want to return the result even if save fails, 
            // but for this app flow, the result page depends on the DB ID.
            // We will return the result, but client might not be able to redirect.
        }

        return NextResponse.json({
            ...finalResponse,
            id: insertedId // Send ID back to client
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
