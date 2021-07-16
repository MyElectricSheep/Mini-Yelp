require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const errorHandler = require("./middlewares/errorHandler");

const seedRouter = require("./routes/seed");
const cityRouter = require("./routes/city");
const tagRouter = require("./routes/tag");
const restaurantRouter = require("./routes/restaurant");

const app = express();

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
