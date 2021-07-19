const express = require("express");
const tagRouter = express.Router();
const checkResource = require("../../middlewares/checkResource");

const { validateTag } = require("./tag.validators");
const { validateId } = require("../../middlewares/validateId");

const {
  create,
  readOne,
  readAll,
  update,
  deleteOne,
} = require("./tag.controller");

tagRouter
  .route("/:id")
  .get([validateId, checkResource, readOne])
  .put([validateId, checkResource, update])
  .delete([validateId, checkResource, deleteOne]);

tagRouter.route("/").get(readAll).post([validateTag, create]);

module.exports = tagRouter;
