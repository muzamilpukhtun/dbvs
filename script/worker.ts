// //lib/worker.ts
// import * as BullMQ from "bullmq";
// import { connection } from "../lib/connection";  // Adjust karo agar tumhare connection ka path alag hai

// export const worker = new BullMQ.Worker(
//   "pollQueue",
//   async (job) => {
//     console.log("📦 Processing Job:", job.data);

//     // Example: Poll ka result announce karne ki logic yahan aayegi
//     const { pollId } = job.data;
//     console.log(`✅ Poll ${pollId} ka result announce hoga...`);

//     // TODO: Blockchain interaction, result calculation, DB update waghera
//   },
//   { connection }
// );






// //script/worker.ts
// import { Worker } from "bullmq";
// import { connection } from "../lib/redis";
// import prisma from "@/lib/prisma";
// import fetch from "node-fetch";
// import { Connection } from "@solana/web3.js";

// const solanaConn = new Connection("https://api.devnet.solana.com");

// export const voteWorker = new Worker(
//   "pollQueue",
//   async (job) => {
//     const { pollId, hashList } = job.data;

//     // 🗳️ Process Poll Votes
//     if (job.name === "processPollVotes") {
//       console.log(`🚀 Processing Poll ID: ${pollId}`);

//       const poll = await prisma.poll.findUnique({
//         where: { id: pollId },
//         include: { options: true },
//       });

//       if (!poll) {
//         console.error(`❌ Poll ${pollId} not found`);
//         return;
//       }

//       const voteCounts = new Map<string, number>();
//       poll.options.forEach((opt) => voteCounts.set(opt.text.trim(), 0));

//       const response = await fetch("http://localhost:3000/api/poll/vote-count");
//       const data = await response.json();

//       if (!data?.polls || !Array.isArray(data.polls)) {
//         console.error("❌ Invalid vote data from API");
//         return;
//       }

//       const relevantVotes = data.polls.filter((v) => String(v.poll_id) === String(pollId));
//       console.log(`🔎 Found ${relevantVotes.length} votes for Poll ${pollId}`);

//       relevantVotes.forEach((vote) => {
//         const option = vote.option?.trim();
//         if (option && voteCounts.has(option)) {
//           voteCounts.set(option, (voteCounts.get(option) || 0) + 1);
//           console.log(`✅ Counted vote for "${option}"`);
//         } else {
//           console.warn(`⚠️ Unknown option "${option}"`);
//         }
//       });

//       await prisma.$transaction([
//         prisma.poll.update({
//           where: { id: pollId },
//           data: { isResultAnnounced: true },
//         }),
//         ...poll.options.map((opt) =>
//           prisma.option.update({
//             where: { id: opt.id },
//             data: { votes: voteCounts.get(opt.text.trim()) || 0 },
//           })
//         ),
//       ]);

//       console.log(`✅ Results saved for Poll ${pollId}`);
//     }

//     // 🔄 Process Pending Votes
//     if (job.name === "processPendingVotes") {
//       console.log("🔄 Processing pending votes...");

//       const pendingVotes = await prisma.pendingVote.findMany();

//       for (const vote of pendingVotes) {
//         try {
//           const txStatus = await solanaConn.getConfirmedTransaction(vote.txData.txSignature);

//           if (txStatus) {
//             await prisma.vote.create({
//               data: {
//                 pollId: vote.pollId,
//                 optionId: vote.optionId,
//                 voterId: vote.voterId,
//                 txHash: vote.txData.txSignature,
//                 status: "CONFIRMED",
//               },
//             });

//             await prisma.pendingVote.delete({ where: { id: vote.id } });
//             console.log(`✅ Vote confirmed for Poll ${vote.pollId}`);
//           }
//         } catch (err) {
//           console.error("❌ Error processing vote", err);
//         }
//       }
//     }
//   },
//   {
//     connection,
//     concurrency: 1,
//     lockDuration: 300000,
//     removeOnComplete: { count: 100 },
//     removeOnFail: { count: 100 },
//   }
// );




// // script/worker.ts
import { Worker } from "bullmq";
import { connection,pollQueue } from "../lib/redis";
import prisma from "@/lib/prisma";
import fetch from "node-fetch";
import { Connection } from "@solana/web3.js";

const solanaConn = new Connection("https://api.devnet.solana.com");

export const voteWorker = new Worker(
  "pollQueue",
  async (job) => {
    const { pollId, hashList } = job.data;

    // 🗳️ Process Poll Votes
   if (job.name === "processPollVotes") {
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: { options: true },
  });

  if (!poll) return;

  if (poll.isResultAnnounced) {
    console.log(`⏩ Poll ${poll.id} result already announced. Skipping.`);
    return;
  }

  if (new Date(poll.endDate) > new Date()) {
    console.log(`⏩ Poll ${poll.id} still active, skipping processing.`);
    return;
  }

      const voteCounts = new Map<string, number>();
      poll.options.forEach((opt) => voteCounts.set(opt.text.trim(), 0));

      const response = await fetch("http://localhost:3000/api/poll/vote-count");
      const data = await response.json();

      if (!data?.polls || !Array.isArray(data.polls)) {
        console.error("❌ Invalid vote data from API");
        return;
      }

      const relevantVotes = data.polls.filter((v) => String(v.poll_id) === String(pollId));
      console.log(`🔎 Found ${relevantVotes.length} votes for Poll ${pollId}`);

      relevantVotes.forEach((vote) => {
        const option = vote.option?.trim();
        if (option && voteCounts.has(option)) {
          voteCounts.set(option, (voteCounts.get(option) || 0) + 1);
          console.log(`✅ Counted vote for "${option}"`);
        } else {
          console.warn(`⚠️ Unknown option "${option}"`);
        }
      });

      await prisma.$transaction([
        prisma.poll.update({
          where: { id: pollId },
          data: { isResultAnnounced: true },
        }),
        ...poll.options.map((opt) =>
          prisma.option.update({
            where: { id: opt.id },
            data: { votes: voteCounts.get(opt.text.trim()) || 0 },
          })
        ),
      ]);

      console.log(`✅ Results saved for Poll ${pollId}`);
    }

// 🔄 Checking End Polls
    if (job.name === "checkEndedPolls") {
  console.log("🔍 Checking ended polls...");

  const endedPolls = await prisma.poll.findMany({
    where: {
      endDate: { lte: new Date() },
      isResultAnnounced: false,
    },
    include: { options: true },
  });

  for (const poll of endedPolls) {
    console.log(`📦 Queueing Poll ID ${poll.id} for processing`);
    await pollQueue.add("processPollVotes", { pollId: poll.id });
  }

  console.log(`✅ Queued ${endedPolls.length} ended polls for processing`);
}

    // 🔄 Process Pending Votes
    if (job.name === "processPendingVotes") {
      console.log("🔄 Processing pending votes...");

      const pendingVotes = await prisma.pendingVote.findMany();
      if(pendingVotes){
           for (const vote of pendingVotes) {
        try {
             // Check Poll Ended or Not
      const poll = await prisma.poll.findUnique({
        where: { id: vote.pollId },
      });

      if (!poll) {
        console.warn(`⚠️ Poll ${vote.pollId} not found.`);
        continue;
      }

      // ✅ Only process vote if poll has ended
      if (new Date(poll.endDate) > new Date()) {
        console.log(`⏩ Poll ${poll.id} still active, skipping vote processing.`);
        continue;
      }

 const txHash = vote.txData?.txHash;

    if (!txHash || typeof txHash !== "string") {
      console.warn(`⚠️ Invalid txHash for vote ID ${vote.id}:`, txHash);
      continue;
    }

    const txStatus = await solanaConn.getConfirmedTransaction(txHash);
    console.log("tx status", txHash);
//           if (txStatus) {
//             await prisma.vote.create({
//               data: {
//                 pollId: vote.pollId,
//                 optionId: vote.optionId,
//                 voterId: vote.voterId,
//                 txHash: txHash,
//                 status: "CONFIRMED",
//               },
//             });

//             // await prisma.pendingVote.delete({ where: { id: vote.id } });
//             await prisma.pendingVote.deleteMany({
//   where: { id: vote.id },
// });
//             console.log(`✅ Vote confirmed for Poll ${vote.pollId}`);
//             await pollQueue.add("processPollVotes", { pollId: vote.pollId });


//           }
if (txStatus) {
  await prisma.vote.create({
              data: {
                pollId: vote.pollId,
                optionId: vote.optionId,
                voterId: vote.voterId,
                txHash: txHash,
                status: "CONFIRMED",
}});
  await prisma.pendingVote.delete({ where: { id: vote.id } });

  // Sirf jab poll khatam ho chuki ho tab processPollVotes lagao
  const poll = await prisma.poll.findUnique({ where: { id: vote.pollId } });
  
  if (poll && new Date(poll.endDate) <= new Date() && !poll.isResultAnnounced) {
    await pollQueue.add("processPollVotes", { pollId: vote.pollId });
  }
}
        } catch (err) {
          console.error("❌ Error processing vote", err);
        }
      }
    }
    console.log("🔄 Processing pending votes...");
    }
  },
  {
    connection,
    concurrency: 1,
    lockDuration: 300000,
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 100 },
  }
);