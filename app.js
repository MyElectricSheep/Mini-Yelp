require("dotenv").config();
require("./utilities/refreshDB");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const errorHandler = require("./middlewares/errorHandler");

const { seedRouter } = require("./entities/seed");
const { cityRouter } = require("./entities/city");
const { restaurantRouter } = require("./entities/restaurant");
const { tagRouter } = require("./entities/tag");

const app = express();

app.use(helmet());
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/seed", seedRouter);
app.use("/city", cityRouter);
app.use("/tag", tagRouter);
app.use("/restaurant", restaurantRouter);

app.get("/not-found", (req, res) => {
  res.status(404).send("These are not the routes you are looking for...");
});

app.get("/", (req, res) => {
  res.send("Welcome to Mini-Yelp!");
});

app.get("*", (req, res, next) => {
  const error = new Error(`${req.ip} tried to access ${req.originalUrl}`);
  error.statusCode = 301;
  next(error);
});

app.use(errorHandler);

module.exports = app;
