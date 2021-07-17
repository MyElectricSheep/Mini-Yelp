const cron = require("node-cron");
const { create, seed, destroy } = require("../entities/seed/seed.controller");

cron.schedule("15 0 * * *", () => {
  destroy({ cron: true });
  create({ cron: true });
  seed({ cron: true });
  console.log("Database refreshed");
});

// https://crontab.guru/#15_0_*_*_*
