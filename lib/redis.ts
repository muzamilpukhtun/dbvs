//lib/redis.ts
import { Queue, QueueEvents } from "bullmq";
import IORedis from "ioredis";

export const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,  // Yeh zaroor add karo BullMQ v5 compatibility ke liye
});

export const pollQueue = new Queue("pollQueue", { connection });

export const queueEvents = new QueueEvents("pollQueue", { connection });

queueEvents.on("completed", ({ jobId }) => {
  console.log(`✅ Job ${jobId} completed`);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(`❌ Job ${jobId} failed: ${failedReason}`);
});
