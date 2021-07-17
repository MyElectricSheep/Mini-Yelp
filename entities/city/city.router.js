const express = require("express");
const cityRouter = express.Router();
const checkResource = require("../../middlewares/checkResource");
const { validateNewCity, validateUpdateCity } = require("./city.validators");

const {
  readOne,
  readOneWithRestaurants,
  readAll,
  readAllWithRestaurants,
  create,
  update,
  deleteOne,
} = require("./city.controller");

cityRouter.get("/:id/restaurants", [checkResource, readOneWithRestaurants]);
cityRouter.get("/restaurants", readAllWithRestaurants);

cityRouter
  .route("/:id")
  .get([checkResource, readOne])
  .put([validateUpdateCity, checkResource, update])
  .delete([checkResource, deleteOne]);

cityRouter.route("/").get(readAll).post([validateNewCity, create]);

module.exports = cityRouter;
