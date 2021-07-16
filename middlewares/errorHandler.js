const errorHandler = (error, req, res, next) => {
  if (!error.statusCode) error.statusCode = 500;

  if (error.statusCode === 301) {
    return res.redirect("/not-found");
  }

  res.json({
    error: "Something broke!",
    status: error.statusCode,
    message: error.message,
    stack: error.stack,
  });
};

module.exports = errorHandler;
