"use client";

import React, { useState } from "react";
import { RhythmPoint } from "@/lib/engine/saju";
import { motion, AnimatePresence } from "framer-motion";

interface LifeRhythmChartProps {
    data: RhythmPoint[];
}

/**
 * Generates a smooth SVG path using cubic bezier curves (similar to curveMonotoneX logic simplified)
 */
function generateSmoothPath(points: { x: number; y: number }[]): string {
    if (points.length < 2) return "";

    let path = `M ${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];

        // Control points for a smooth transition
        const cp1x = p0.x + (p1.x - p0.x) / 2;
        const cp1y = p0.y;
        const cp2x = p0.x + (p1.x - p0.x) / 2;
        const cp2y = p1.y;

        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
    }

    return path;
}

export default function LifeRhythmChart({ data }: LifeRhythmChartProps) {
    const [hoveredPoint, setHoveredPoint] = useState<RhythmPoint | null>(null);

    const width = 400;
    const height = 150;
    const padding = 30;

    // Map data to SVG coordinates
    const chartPoints = data.map((p, i) => ({
        x: padding + (i * (width - 2 * padding)) / (data.length - 1),
        y: height - padding - (p.score / 100) * (height - 2 * padding),
    }));

    const pathData = generateSmoothPath(chartPoints);

    // Filter inflection points (peaks, troughs, or stage changes)
    const getInflectionPoints = () => {
        return chartPoints.filter((_, i) => {
            if (i === 0 || i === chartPoints.length - 1) return true;
            const prev = data[i - 1].score;
            const curr = data[i].score;
            const next = data[i + 1].score;
            return (curr > prev && curr >= next) || (curr < prev && curr <= next);
        });
    };

    const inflectionPoints = getInflectionPoints();

    return (
        <div className="w-full flex flex-col items-center space-y-6 pt-10 pb-6 bg-[#FAF8F5]">
            <div className="text-center space-y-2 mb-4">
                <span className="text-[10px] font-sans tracking-[0.3em] text-[#E07A5F] uppercase">Life Rhythm</span>
                <h4 className="text-xl font-serif text-[#2A2A2A]">인생 사계절의 흐름</h4>
            </div>

            <div className="relative w-full max-w-[420px] aspect-[4/2] px-4">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Background Grid Lines (Subtle) */}
                    {[0, 25, 50, 75, 100].map((level) => {
                        const y = height - padding - (level / 100) * (height - 2 * padding);
                        return (
                            <line
                                key={level}
                                x1={padding}
                                y1={y}
                                x2={width - padding}
                                y2={y}
                                stroke="#2A2A2A"
                                strokeWidth="0.5"
                                strokeOpacity="0.05"
                            />
                        );
                    })}

                    {/* Main Rhythm Path */}
                    <motion.path
                        d={pathData}
                        fill="none"
                        stroke="#2A2A2A"
                        strokeWidth="1.2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />

                    {/* Inflection Points */}
                    {chartPoints.map((p, i) => {
                        const isInflection = inflectionPoints.some(ip => ip.x === p.x && ip.y === p.y);
                        return (
                            <g key={i}>
                                {/* Interaction Invisible Area */}
                                <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r="15"
                                    fill="transparent"
                                    className="cursor-pointer"
                                    onMouseEnter={() => setHoveredPoint(data[i])}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                />

                                {/* Visible Point */}
                                {isInflection && (
                                    <motion.circle
                                        cx={p.x}
                                        cy={p.y}
                                        r="2.5"
                                        fill="#E07A5F"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 1 + i * 0.1 }}
                                    />
                                )}
                            </g>
                        );
                    })}

                    {/* X-Axis Labels (Age) */}
                    {data.filter((_, i) => i % 2 === 0).map((p, i) => {
                        const x = padding + (i * 2 * (width - 2 * padding)) / (data.length - 1);
                        return (
                            <text
                                key={i}
                                x={x}
                                y={height - 5}
                                textAnchor="middle"
                                className="text-[9px] fill-[#2A2A2A]/40 font-sans tracking-tighter"
                            >
                                {p.age}세
                            </text>
                        );
                    })}
                </svg>

                {/* Poetic Tooltip */}
                <AnimatePresence>
                    {hoveredPoint && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute -top-16 left-1/2 -translate-x-1/2 w-[280px] bg-white/90 backdrop-blur-sm p-4 border border-[#2A2A2A]/10 shadow-sm z-30 pointer-events-none"
                        >
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-[10px] font-sans text-[#E07A5F] font-bold">
                                    {hoveredPoint.age}세 • {hoveredPoint.stage}
                                </p>
                                <p className="text-[10px] font-serif text-[#2A2A2A]/60">
                                    [{hoveredPoint.category}: {hoveredPoint.label}]
                                </p>
                            </div>
                            <p className="text-xs font-serif leading-relaxed text-[#2A2A2A]">
                                {hoveredPoint.description}
                            </p>
                            {/* Small Arrow */}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/90 rotate-45 border-r border-b border-[#2A2A2A]/10"></div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
