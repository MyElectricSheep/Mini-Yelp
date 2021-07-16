const db = require("../dabatase/client");

const checkResource = async (req, res, next) => {
  try {
    const allowedResources = ["city", "restaurant", "comment", "tag"];
    const targetResource = req.baseUrl.substring(1);

    if (!allowedResources.some((r) => r === targetResource)) {
      const error = new Error(
        `${req.ip} tried to access ${targetResource}. This is not a valid resource.`
      );
      error.statusCode = 301;
      next(error);
    }

    const { id } = req.params;

    const resourceQuery = {
      text: `SELECT * FROM ${targetResource} WHERE id=$1`,
      values: [id],
    };

    const { rows } = await db.query(resourceQuery);

    if (!rows.length)
      return res.status(404).send("This resource does not exist");

    req.resource = rows;
    next();
  } catch (e) {
    next(e);
  }
};

module.exports = checkResource;
