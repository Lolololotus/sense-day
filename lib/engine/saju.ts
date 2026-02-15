// lib/engine/saju.ts
import { Solar, Lunar } from 'lunar-javascript';

export interface SajuData {
    fourPillars: {
        year: string;
        month: string;
        day: string;
        time: string;
    };
    dayMaster: string; // Ilgan (The User's Core Element / Self)
    elements: { [key: string]: number }; // Wood, Fire, Earth, Metal, Water count
    animal: string; // Zodiac Animal (Year Branch)
}

export interface RhythmPoint {
    age: number;
    year: number;
    score: number;
    stage: string; // e.g. "장생"
    category: "봄" | "여름" | "가을" | "겨울";
    label: string;
    description: string;
}

// Mappings for Heavenly Stems (Cheongan) -> Element
const GAN_MAP: { [key: string]: string } = {
    '甲': 'Wood', '乙': 'Wood',
    '丙': 'Fire', '丁': 'Fire',
    '戊': 'Earth', '己': 'Earth',
    '庚': 'Metal', '辛': 'Metal',
    '壬': 'Water', '癸': 'Water'
};

// Mappings for Earthly Branches (Jiji) -> Element
const ZHI_MAP: { [key: string]: string } = {
    '寅': 'Wood', '卯': 'Wood',
    '巳': 'Fire', '午': 'Fire',
    '辰': 'Earth', '戌': 'Earth', '丑': 'Earth', '未': 'Earth',
    '申': 'Metal', '酉': 'Metal',
    '亥': 'Water', '子': 'Water'
};

// Mappings for Zodiac Animals
const ANIMAL_MAP: { [key: string]: string } = {
    '子': 'Rat', '丑': 'Ox', '寅': 'Tiger', '卯': 'Rabbit',
    '辰': 'Dragon', '巳': 'Snake', '午': 'Horse', '未': 'Goat',
    '申': 'Monkey', '酉': 'Rooster', '戌': 'Dog', '亥': 'Pig'
};

// Proper 12 Stages Index (0: 子, 1: 丑, ..., 11: 亥)
// Order of stages: 0:장생(Birth), 1:목욕(Bath), 2:관대(Dress), 3:건록(Peak), 4:제왕(Prosperity), 5:쇠(Decline), 6:병(Sickness), 7:사(Death), 8:묘(Grave), 9:절(Cut), 10:태(Embryo), 11:양(Nourish)
const STAGES = ["장생", "목욕", "관대", "건록", "제왕", "쇠", "병", "사", "묘", "절", "태", "양"];
const JIJI_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const STAGE_SCORES: { [key: string]: number } = {
    "제왕": 100, "건록": 90, "관대": 80, "장생": 75,
    "쇠": 60, "양": 50, "태": 40, "목욕": 30,
    "병": 20, "사": 15, "묘": 10, "절": 5
};

const STAGE_PERSONA = {
    "여름": { label: "도약", desc: "태양의 열기를 온몸으로 받아내는 시기입니다. 가장 뜨겁고 화려하게 당신의 세계를 확장하십시오." },
    "봄": { label: "개화", desc: "움츠렸던 씨앗이 땅을 뚫고 나오는 시기입니다. 당신의 가능성이 처음으로 꽃을 피웁니다." },
    "가을": { label: "갈무리", desc: "결실을 맺고 소중한 것들을 분류하는 시기입니다. 당신의 삶이 한층 더 깊고 단단해집니다." },
    "겨울": { label: "심연", desc: "고요히 내면으로 침잠하여 다음 봄을 준비하는 시기입니다. 이 어둠은 당신을 삼키는 것이 아니라 품어주는 것입니다." }
};

// Map Day Master to starting Jiji index for "장생(Birth)"
const BIRTH_JIJI_INDEX: { [key: string]: number } = {
    '甲': 11, // 亥
    '丙': 2,  // 寅
    '戊': 2,  // 寅
    '庚': 5,  // 巳
    '壬': 8,  // 申
    '乙': 6,  // 午 (Reverse)
    '丁': 9,  // 酉 (Reverse)
    '己': 9,  // 酉 (Reverse)
    '辛': 0,  // 子 (Reverse)
    '癸': 3   // 卯 (Reverse)
};


export function calculateSaju(date: Date): SajuData {
    // Ensure we handle invalid dates
    const safeDate = isNaN(date.getTime()) ? new Date() : date;

    // Lunar-javascript accepts YYYY, MM, DD, HH, mm, ss
    const solar = Solar.fromYmdHms(
        safeDate.getFullYear(),
        safeDate.getMonth() + 1,
        safeDate.getDate(),
        safeDate.getHours(),
        safeDate.getMinutes(),
        safeDate.getSeconds()
    );

    const lunar = solar.getLunar();
    const eightChar = lunar.getEightChar(); // BaZi (Palja)

    // Ensure we get strings
    const yearGan = eightChar.getYearGan().toString();
    const yearZhi = eightChar.getYearZhi().toString();
    const monthGan = eightChar.getMonthGan().toString();
    const monthZhi = eightChar.getMonthZhi().toString();
    const dayGan = eightChar.getDayGan().toString();
    const dayZhi = eightChar.getDayZhi().toString();
    const timeGan = eightChar.getTimeGan().toString();
    const timeZhi = eightChar.getTimeZhi().toString();

    // Heavenly Stems (Cheongan) & Earthly Branches (Jiji)
    const result: SajuData = {
        fourPillars: {
            year: `${yearGan}${yearZhi}`,
            month: `${monthGan}${monthZhi}`,
            day: `${dayGan}${dayZhi}`,
            time: `${timeGan}${timeZhi}`,
        },
        dayMaster: dayGan, // The Ilgan
        elements: calculateElementBalance([
            yearGan, yearZhi, monthGan, monthZhi, dayGan, dayZhi, timeGan, timeZhi
        ]),
        animal: ANIMAL_MAP[yearZhi] || "Unknown" // Zodiac Animal
    };

    return result;
}

function calculateElementBalance(chars: string[]): { [key: string]: number } {
    const counts: { [key: string]: number } = {
        Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0
    };

    chars.forEach(char => {
        // Check both maps
        const element = GAN_MAP[char] || ZHI_MAP[char];

        if (element && counts[element] !== undefined) {
            counts[element]++;
        }
    });

    return counts;
}

export function calculateLifeRhythm(birthDate: Date): RhythmPoint[] {
    const safeDate = isNaN(birthDate.getTime()) ? new Date("2000-01-01") : birthDate;
    const saju = calculateSaju(safeDate);
    const dayMaster = saju.dayMaster;
    const isYin = ['乙', '丁', '己', '辛', '癸'].includes(dayMaster);
    const birthJijiIdx = BIRTH_JIJI_INDEX[dayMaster] ?? 0;

    const rhythm: RhythmPoint[] = [];
    const birthYear = safeDate.getFullYear();

    // Generate for ages 0 to 90 (10-year increments)
    for (let age = 0; age <= 90; age += 10) {
        const targetYear = birthYear + age;

        // Simple approximation: Yearly branch cycle
        const d = new Date(targetYear, 0, 1, 12, 0, 0);
        const solar = Solar.fromYmdHms(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
        const lunar = solar.getLunar();
        const yearZhi = lunar.getEightChar().getYearZhi().toString();

        const zhiIdx = JIJI_ORDER.indexOf(yearZhi);
        let stageIdx: number;

        if (isYin) {
            stageIdx = (birthJijiIdx - zhiIdx + 12) % 12;
        } else {
            stageIdx = (zhiIdx - birthJijiIdx + 12) % 12;
        }

        const stage = STAGES[stageIdx];
        const score = STAGE_SCORES[stage];

        // Categorize by energy
        let category: "봄" | "여름" | "가을" | "겨울";
        if (score >= 80) category = "여름";
        else if (score <= 20 || stage === "절" || stage === "태") category = "겨울";
        else if (stageIdx < 4 || stageIdx === 11) category = "봄"; // Growth stages
        else category = "가을"; // Falling/Mature stages

        rhythm.push({
            age,
            year: targetYear,
            score,
            stage,
            category,
            label: STAGE_PERSONA[category].label,
            description: (stage === "절" || stage === "태")
                ? "고요히 내면으로 침잠하여 다음 봄을 준비하는 시기입니다. 이 어둠은 당신을 삼키는 것이 아니라 새로운 시작을 품어주는 심연입니다."
                : STAGE_PERSONA[category].desc
        });
    }

    return rhythm;
}
