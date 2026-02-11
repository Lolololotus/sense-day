"use client";

import { motion } from "framer-motion";

export default function GeometricFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative w-full max-w-[480px] mx-auto p-8 md:p-12">
            {/* SVG Frame Layer */}
            <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Outer Border Drawing Animation */}
                    <motion.rect
                        x="2" y="2" width="96" height="96"
                        fill="none"
                        stroke="#2A2A2A"
                        strokeWidth="0.2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.8 }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                    />

                    {/* Inner Decorative Lines - Corners */}
                    {/* Top Left */}
                    <motion.path
                        d="M 2 15 L 2 2 L 15 2"
                        fill="none"
                        stroke="#E07A5F"
                        strokeWidth="0.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    />
                    {/* Bottom Right */}
                    <motion.path
                        d="M 98 85 L 98 98 L 85 98"
                        fill="none"
                        stroke="#E07A5F"
                        strokeWidth="0.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    />

                    {/* Geometric Accents - Diamonds */}
                    <motion.rect
                        x="49" y="1" width="2" height="2" transform="rotate(45 50 2)"
                        fill="#2A2A2A"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 2, type: "spring" }}
                    />
                    <motion.rect
                        x="49" y="97" width="2" height="2" transform="rotate(45 50 98)"
                        fill="#2A2A2A"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 2.2, type: "spring" }}
                    />
                </svg>
            </div>

            {/* Content Content Layer */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="relative z-10"
            >
                {children}
            </motion.div>
        </div>
    );
}
