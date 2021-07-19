const cron = require("node-cron");
const { rebootDb } = require("./rebootDb");

// Every day at 00:15am => Wipe the database clean and re-create it:
cron.schedule("15 0 * * *", async () => {
  rebootDb();
  console.log("Database refreshed");
});

// https://crontab.guru/#15_0_*_*_*
