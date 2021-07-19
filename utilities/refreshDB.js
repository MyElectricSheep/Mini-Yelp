const cron = require("node-cron");
const { create, seed, destroy } = require("../entities/seed/seed.controller");

// Every day at 00:15am => Wipe the database clean and re-create it:
cron.schedule("15 0 * * *", async () => {
  await destroy({ cron: true });
  await create({ cron: true });
  await seed({ cron: true });
  console.log("Database refreshed");
});

// https://crontab.guru/#15_0_*_*_*
