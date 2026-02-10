"use client";

import { useState } from "react";
import { Gem, Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface MintButtonProps {
    resultId: string;
    colorCode: string;
}

export default function MintButton({ resultId, colorCode }: MintButtonProps) {
    const [status, setStatus] = useState<"idle" | "minting" | "success" | "error">("idle");
    const [txHash, setTxHash] = useState<string | null>(null);

    const handleMint = async () => {
        setStatus("minting");
        try {
            const res = await fetch("/api/mint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resultId })
            });
            const data = await res.json();

            if (data.success) {
                setTxHash(data.transactionHash);
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch (e) {
            console.error(e);
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100"
            >
                <div className="flex items-center gap-2 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span>SBT Acquired</span>
                </div>
                {txHash && (
                    <a
                        href={`https://etherscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-emerald-400 flex items-center hover:underline"
                    >
                        View on Explorer <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                )}
            </motion.div>
        );
    }

    return (
        <button
            onClick={handleMint}
            disabled={status === "minting"}
            style={{
                color: status === "minting" ? "#9ca3af" : colorCode,
                borderColor: status === "minting" ? "#e5e7eb" : `${colorCode}40`
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border bg-stone-50 hover:bg-stone-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {status === "minting" ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-stone-400">Minting...</span>
                </>
            ) : (
                <>
                    <Gem className="w-4 h-4" />
                    <span className="text-sm font-medium">Mint SBT</span>
                </>
            )}
        </button>
    );
}
