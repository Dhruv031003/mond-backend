import cron from "node-cron";
import { archiveExpiredStories } from "../services/storyArchiver.js";

export default function startArchiverCron({ cronExpression = "*/5 * * * *" } = {}) {
  console.log(`[archiver] scheduling with expression: ${cronExpression}`);

  const task = cron.schedule(cronExpression, async () => {
    console.log("[archiver] job started");
    try {
      const summary = await archiveExpiredStories({ batchSize: 1000 });
      console.log("[archiver] done", summary);
    } catch (err) {
      console.error("[archiver] failed:", err);
    }
  });
  return task; 
}
