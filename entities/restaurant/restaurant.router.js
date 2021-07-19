const express = require("express");
const restaurantRouter = express.Router();
const {
  readOne,
  readAll,
  createOne,
  updateOne,
  deleteOne,
} = require("./restaurant.controller");

const { validateRestaurant } = require("./restaurant.validators");
const { validateId } = require("../../middlewares/validateId");

const checkResource = require("../../middlewares/checkResource");

restaurantRouter
  .route("/:id")
  .get([validateId, checkResource, readOne])
  .put([validateId, checkResource, updateOne])
  .delete([validateId, checkResource, deleteOne]);

restaurantRouter.get("/", readAll);
restaurantRouter.post("/", [validateRestaurant, createOne]);

module.exports = restaurantRouter;
