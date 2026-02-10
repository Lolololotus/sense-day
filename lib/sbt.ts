
// import { Result } from './supabase'; // Types not exported, using any for now or defining locally
import { REMEDY_MAPPING } from './remedy';

interface Result {
    id: string;
    created_at: string;
    user_profile: any;
    analysis_result: any;
}

export interface SBTAttribute {
    trait_type: string;
    value: string | number;
}

export interface SBTMetadata {
    name: string;
    description: string;
    image: string; // URL to the visual representation
    external_url?: string;
    attributes: SBTAttribute[];
}

export function generateSBTMetadata(result: any, baseUrl: string): SBTMetadata {
    const { user_profile, analysis_result, id, created_at } = result;
    const { art_curation } = analysis_result;

    // Format Date
    const dateObj = new Date(created_at);
    const dateStr = dateObj.toISOString().split('T')[0];

    return {
        name: `SYD Record #${dateStr}`, // e.g., SYD Record #2026-02-10
        description: `A Soulbound Record of ${user_profile.name}'s sensory prescription on ${dateStr}.`,
        image: `${baseUrl}/api/og?id=${id}`, // We might need an OG image generator later, for now placeholder
        external_url: `${baseUrl}/result/${id}`,
        attributes: [
            {
                trait_type: "Element",
                value: art_curation.missingElement
            },
            {
                trait_type: "Lucky Color",
                value: art_curation.colorCode // Storing the hex or name
            },
            {
                trait_type: "Keyword",
                value: art_curation.keyword
            },
            {
                trait_type: "Rhythm",
                value: art_curation.musicTempo
            },
            {
                trait_type: "Type",
                value: "Soulbound Remedy"
            }
        ]
    };
}
