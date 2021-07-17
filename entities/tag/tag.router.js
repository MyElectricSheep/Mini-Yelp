const express = require("express");
const tagRouter = express.Router();
const checkResource = require("../../middlewares/checkResource");

const {
  create,
  readOne,
  readAll,
  update,
  deleteOne,
} = require("./tag.controller");

tagRouter
  .route("/:id")
  .get([checkResource, readOne])
  .put([checkResource, update])
  .delete([checkResource, deleteOne]);

tagRouter.route("/").get(readAll).post(create);

module.exports = tagRouter;
