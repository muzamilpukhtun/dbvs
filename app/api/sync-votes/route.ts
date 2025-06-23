//app/sync-votes
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { fetchRecentVotesFromChain } from '@/lib/blockchain';

export async function POST(request: Request) {
  // Get transaction hash from request body
  const { txHash } = await request.json();
  
  // Fetch single vote data from chain
  const votes = await fetchRecentVotesFromChain(1);
  const vote = votes.find(v => v.txHash === txHash);

  if (!vote) {
    return NextResponse.json({
      success: false,
      message: 'Transaction not found'
    });
  }

  try {
    // Save vote to database
    await prisma.vote.upsert({
      where: { txHash: vote.txHash },
      update: {},
      create: {
        pollId: vote.pollId,
        optionId: vote.optionId,
        voterId: vote.voterId,
        txHash: vote.txHash,
        status: 'CONFIRMED',
      },
    });

    // Update option vote count
    await prisma.option.update({
      where: { id: vote.optionId },
      data: { votes: { increment: 1 } },
    });

    // Fetch updated poll data
    const updatedPoll = await prisma.poll.findUnique({
      where: { id: vote.pollId },
      include: {
        options: true,
      },
    });

    return NextResponse.json({
      success: true,
      vote: vote,
      updatedPoll: updatedPoll
    });

  } catch (err) {
    console.error('Failed to sync vote:', vote.txHash);
    return NextResponse.json({
      success: false,
      message: 'Failed to sync vote',
      error: err
    });
  }
}
