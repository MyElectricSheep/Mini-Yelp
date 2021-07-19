const Joi = require("joi");
const validateRequest = require("../../middlewares/validateRequest");

const validateRestaurant = (req, res, next) => {
  const dataToValidate = { ...req.body };
  const schema = Joi.object({
    name: Joi.string().min(2).max(80).required(),
    picture: Joi.string().uri().required(),
    city_id: Joi.number().integer().required(),
    longitude: Joi.number().greater(-180).less(180).required(),
    latitude: Joi.number().greater(-90).less(90).required(),
  });
  validateRequest(req, next, dataToValidate, schema);
};

module.exports = {
  validateRestaurant,
};
