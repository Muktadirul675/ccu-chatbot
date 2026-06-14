// src/queues/lead.queue.ts

import { Queue } from "bullmq";
import { redisConnection } from "@/lib/redis";

export const leadQueue = new Queue("lead-processing", {
  connection: redisConnection,
});