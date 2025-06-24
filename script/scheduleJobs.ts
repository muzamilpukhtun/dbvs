// scripts/scheduleJobs.ts
import { pollQueue } from "@/lib/redis";

async function scheduleJobs() {
  await pollQueue.add("checkEndedPolls", {}, {
    repeat: { cron: "*/1 * * * *" },  // Har 1 minute baad check karega
    removeOnComplete: true,
  });
  await pollQueue.add("processPendingVotes", {}, {
    repeat: { cron: "*/2 * * * *" },
    removeOnComplete: true,
  });
  
}

scheduleJobs();
