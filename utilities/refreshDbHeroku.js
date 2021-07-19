const { create, seed, destroy } = require("../entities/seed/seed.controller");

const refreshDB = async () => {
  await destroy({ cron: true });
  await create({ cron: true });
  await seed({ cron: true });
  console.log("Database refreshed");
};

refreshDB();
