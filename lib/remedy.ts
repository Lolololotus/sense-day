// lib/remedy.ts

export interface RemedySchema {
    missingElement: "Wood" | "Fire" | "Earth" | "Metal" | "Water";
    artStyle: string;
    musicTempo: string;
    colorCode: string; // Hex code for Muted Tone
    keyword: string;
}

export const REMEDY_MAPPING: Record<string, RemedySchema> = {
    Wood: {
        missingElement: "Wood",
        artStyle: "Forest, Growth, Vertical Lines",
        musicTempo: "Andante (Walking Pace, nature sounds)",
        colorCode: "#81B29A", // Sage Green (Muted)
        keyword: "Growth (성장)"
    },
    Fire: {
        missingElement: "Fire",
        artStyle: "Impressionism, Light, Warmth",
        musicTempo: "Allegro (Upbeat, Passionate)",
        colorCode: "#E07A5F", // Terracotta (Muted Red)
        keyword: "Passion (열정)"
    },
    Earth: {
        missingElement: "Earth",
        artStyle: "Landscape, Horizon, Texture",
        musicTempo: "Adagio (Slow, Grounded)",
        colorCode: "#F2CC8F", // Mustard Yellow (Muted)
        keyword: "Stability (안정)"
    },
    Metal: {
        missingElement: "Metal",
        artStyle: "Minimalism, Geometry, Clarity",
        musicTempo: "Moderato (Clean, structured)",
        colorCode: "#A8DADC", // Pale Cyan (Muted Silver/Blue)
        keyword: "Clarity (명료)"
    },
    Water: {
        missingElement: "Water",
        artStyle: "Abstract, Fluidity, Depth",
        musicTempo: "Largo (Flowing, Deep)",
        colorCode: "#3D5A80", // Slate Blue (Muted)
        keyword: "Wisdom (지혜)"
    }
};

export interface SBTMetadata {
    name: string;
    description: string;
    image: string; // URL to the generated art/remedy card
    attributes: {
        trait_type: string;
        value: string | number;
    }[];
}
