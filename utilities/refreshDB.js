const cron = require("node-cron");
const { create, seed, destroy } = require("../entities/seed/seed.controller");

cron.schedule("20 0 * * *", async () => {
  await destroy({ cron: true });
  await create({ cron: true });
  await seed({ cron: true });
  console.log("Database refreshed");
});

// https://crontab.guru/#15_0_*_*_*
