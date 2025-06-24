//scripts/voteResultProcessor.ts
import { Worker } from "bullmq";
import { connection } from "../lib/redis";
import prisma from "@/lib/prisma";
import fetch from "node-fetch"; // Node fetch for server side
import { PublicKey } from "@solana/web3.js";

const voteWorker = new Worker("pollQueue", async (job) => {
  console.log(`\n🚀 Processing Poll ID: ${job.data.pollId}`);

  try {
    const pollId = job.data.pollId;

    // 1. Poll get karo with options
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: true },
    });

    if (!poll) {
      console.error(`❌ Poll ${pollId} not found`);
      return;
    }

    // 2. Initialize vote counts
    const voteCounts = new Map<string, number>();
    poll.options.forEach(opt => {
      voteCounts.set(opt.text.trim(), 0);
    });

    // 3. Get Vote Data from Your API
    console.log(`🌐 Fetching vote data from /api/poll/vote-count...`);
    const response = await fetch("http://localhost:3000/api/poll/vote-count"); 
    const data = await response.json();

    if (!data?.polls || !Array.isArray(data.polls)) {
      console.error("❌ Invalid or empty polls data from API");
      return;
    }
    console.log("VOTES:",data);

    // 4. Filter votes for this poll
    const relevantVotes = data.polls.filter(v => String(v.poll_id) === String(pollId));

    console.log(`🔎 Found ${relevantVotes.length} votes for Poll ${pollId}`);

    // 5. Count votes
    relevantVotes.forEach(vote => {
      const option = vote.option?.trim();
      if (option && voteCounts.has(option)) {
        voteCounts.set(option, (voteCounts.get(option) || 0) + 1);
        console.log(`✅ Counted vote for "${option}"`);
      } else {
        console.warn(`⚠️ Unknown option: "${option}"`);
      }
    });

    // 6. Console updated counts
    console.log(`\n🗳️ FINAL COUNTS FOR POLL ${pollId}:`);
    Array.from(voteCounts.entries()).forEach(([option, count]) => {
      console.log(`• ${option}: ${count} votes`);
    });

    // 7. Save to Database
    await prisma.$transaction([
      prisma.poll.update({
        where: { id: pollId },
        data: { isResultAnnounced: true }
      }),
      ...poll.options.map(option =>
        prisma.option.update({
          where: { id: option.id },
          data: { votes: voteCounts.get(option.text.trim()) || 0 }
        })
      )
    ]);

    console.log(`\n✅ Results saved for Poll ${pollId}`);
    return { success: true, pollId, counts: Object.fromEntries(voteCounts) };

  } catch (error) {
    console.error(`\n🔥 Error processing poll ${job.data.pollId}:`, error);
    throw error;
  }
}, {
  connection,
  concurrency: 1,
  lockDuration:300000,
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 100 }
});
