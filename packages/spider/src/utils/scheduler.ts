import { CronJob } from "cron";

export const scheduler = new CronJob(
  "* * * * * *", // cronTime
  () => {
    console.log("You will see this message every second");
  }, // onTick
  null, // onComplete
  true, // start
  "Asia/Shanghai", // timeZone
);
