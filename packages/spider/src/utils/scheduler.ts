import { CronJob } from "cron";

export const scheduler = new CronJob(
  "* * * * * *", // cronTime
  () => {
    console.log("You will see this message every second");
  }, // onTick
  null, // onComplete
  false, // start
  "Asia/Shanghai", // timeZone
);
