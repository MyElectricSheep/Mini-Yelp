const express = require("express");
const seedRouter = express.Router();
const { create, seed, destroy } = require("./seedController");

seedRouter.post("/create", create);
seedRouter.delete("/destroy", destroy);
seedRouter.post("/", seed);

module.exports = seedRouter;
