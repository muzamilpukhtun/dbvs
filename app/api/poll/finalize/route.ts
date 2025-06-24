import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Connection } from "@solana/web3.js";

export async function POST(req: Request) {
  const connection = new Connection("https://api.devnet.solana.com");
  try {
    const { pollId } = await req.json();

    if (!pollId) {
      return NextResponse.json({ error: "pollId required" }, { status: 400 });
    }

    const poll = await prisma.poll.findUnique({ where: { id: pollId } });
    if (!poll) return NextResponse.json({ error: "Poll not found" }, { status: 404 });

    if (new Date(poll.endDate) > new Date()) {
      return NextResponse.json({ error: "Poll is still active" }, { status: 400 });
    }

    const pendingVotes = await prisma.pendingVote.findMany({
      where: { pollId: pollId }
    });

    let updatedVotes = 0;

    for (const vote of pendingVotes) {
      const txHash = vote.txData?.txHash;
      try {
        const tx = await connection.getTransaction(txHash, { commitment: "confirmed" });
        if (tx && !tx.meta?.err) {
          await prisma.option.update({
            where: { id: vote.optionId },
            data: { votes: { increment: 1 } }
          });
          updatedVotes++;
        }
      } catch (err) {
        console.warn("Failed to confirm tx:", txHash);
      }
    }

    await prisma.pendingVote.deleteMany({ where: { pollId: pollId } });

    return NextResponse.json({
      message: "Vote finalization complete",
      totalVotes: pendingVotes.length,
      confirmedVotes: updatedVotes
    });

  } catch (err: any) {
    console.error("Finalize Error:", err.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
