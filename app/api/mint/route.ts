import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { resultId } = body;

        console.log(`Minting SBT for result: ${resultId}...`);

        // 1. Simulate Blockchain Delay (Mining)
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 2. "Mint" (Update DB to say minted - PERSISTENCE)
        // Using Admin client to bypass RLS (since Public cannot update)
        const { error } = await supabaseAdmin
            .from('results')
            .update({ is_minted: true })
            .eq('id', resultId);

        if (error) {
            console.error("Failed to persist mint state:", error);
            throw new Error("Database Update Failed");
        }

        // Mock Transaction Hash (Ethereum-like)
        const mockTxHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

        return NextResponse.json({
            success: true,
            message: "SBT Successfully Minted",
            tokenId: Date.now().toString(),
            transactionHash: mockTxHash,
            explorerUrl: `https://etherscan.io/tx/${mockTxHash}`
        });

    } catch (error) {
        console.error("Minting Error:", error);
        return NextResponse.json(
            { error: "Minting Failed" },
            { status: 500 }
        );
    }
}
