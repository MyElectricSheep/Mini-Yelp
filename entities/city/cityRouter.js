const express = require("express");
const cityRouter = express.Router();
const checkResource = require("../../middlewares/checkResource");

const {
  readOne,
  readOneWithRestaurants,
  readAll,
  readAllWithRestaurants,
  create,
  update,
  deleteOne,
} = require("./cityController");

cityRouter.get("/:id/restaurants", [checkResource, readOneWithRestaurants]);
cityRouter.get("/restaurants", readAllWithRestaurants);

cityRouter
  .route("/:id")
  .get([checkResource, readOne])
  .put([checkResource, update])
  .delete([checkResource, deleteOne]);

cityRouter.route("/").get(readAll).post(create);

module.exports = cityRouter;
