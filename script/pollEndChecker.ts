//script/pollEndChecker.ts
import prisma from "@/lib/prisma";
import { pollQueue } from "@/lib/redis";
import dayjs from "dayjs";

async function checkEndedPolls() {
  console.log("🔍 Checking ended polls...");

  // const endedPolls = await prisma.poll.findMany({
  //   where: {
  //     endDate: { lte: new Date() },
  //     isResultAnnounced: false,
  //   },
  //   include: { votes: true },  // Confirm karo votes relation prisma schema mein hai
  // });

  // if (endedPolls.length === 0) {
  //   console.log("⏩ No ended polls found.");
  //   return;
  // }

  // for (const poll of endedPolls) {
  //   console.log(`📦 Queueing Poll ID ${poll.id} for processing`);

  //   const voteHashes = poll.votes.map(v => v.hash);

  //   await pollQueue.add("processPollVotes", {
  //     pollId: poll.id,
  //     hashList: voteHashes,
  //   });
  // }

  // worker ke andar
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
}

  console.log(`✅ Queued ${endedPolls.length} ended polls for processing`);
}

checkEndedPolls()
  .catch(console.error)
  .finally(() => process.exit(0));
