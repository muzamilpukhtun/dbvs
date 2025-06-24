import { RedisOptions } from "bullmq";
import IORedis from "ioredis";

export const connection: RedisOptions["connection"] = {
  host: "127.0.0.1",
  port: 6379,
};
