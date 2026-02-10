import { motion } from "framer-motion";

interface GeometricIconProps {
    type: "Wood" | "Fire" | "Earth" | "Metal" | "Water" | string;
    className?: string;
    color?: string;
}

export default function GeometricIcon({ type, className = "w-8 h-8", color = "currentColor" }: GeometricIconProps) {
    const strokeWidth = 1.5;

    const icons = {
        Wood: (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} className={className}>
                <motion.path
                    d="M12 21V3M12 3L7 8M12 3L17 8M5 21H19"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
                />
            </svg>
        ),
        Fire: (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} className={className}>
                <motion.path
                    d="M12 21L4.5 9L12 2L19.5 9L12 21Z"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
                />
            </svg>
        ),
        Earth: (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} className={className}>
                <motion.rect
                    x="4" y="4" width="16" height="16"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
                />
                <motion.path d="M4 20L20 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5 }} />
            </svg>
        ),
        Metal: (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} className={className}>
                <motion.circle
                    cx="12" cy="12" r="9"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
                />
            </svg>
        ),
        Water: (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} className={className}>
                <motion.path
                    d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 12 2 12 2C12 2 2 6.47715 2 12Z"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
                />
                <motion.path
                    d="M8 14C8 14 10 16 12 16C14 16 16 14 16 14"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }}
                />
            </svg>
        )
    };

    return icons[type as keyof typeof icons] || icons["Earth"];
}
