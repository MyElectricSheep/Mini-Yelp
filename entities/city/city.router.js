const express = require("express");
const cityRouter = express.Router();
const checkResource = require("../../middlewares/checkResource");

const { validateCity } = require("./city.validators");
const { validateId } = require("../../middlewares/validateId");

const {
  readOne,
  readOneWithRestaurants,
  readAll,
  readAllWithRestaurants,
  createOne,
  updateOne,
  deleteOne,
} = require("./city.controller");

cityRouter.get("/:id/restaurants", [
  validateId,
  checkResource,
  readOneWithRestaurants,
]);

cityRouter.get("/restaurants", readAllWithRestaurants);

cityRouter
  .route("/:id")
  .get([validateId, checkResource, readOne])
  .put([validateCity, checkResource, updateOne])
  .delete([checkResource, deleteOne]);

cityRouter.route("/").get(readAll).post([validateCity, createOne]);

module.exports = cityRouter;
