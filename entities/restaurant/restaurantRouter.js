const express = require("express");
const restaurantRouter = express.Router();
const {
  readOne,
  readAll,
  create,
  update,
  deleteOne,
} = require("./restaurantController");
const checkResource = require("../../middlewares/checkResource");

restaurantRouter
  .route("/:id")
  .get([checkResource, readOne])
  .put([checkResource, update])
  .delete([checkResource, deleteOne]);

restaurantRouter.get("/", readAll);
restaurantRouter.post("/", create);

module.exports = restaurantRouter;
