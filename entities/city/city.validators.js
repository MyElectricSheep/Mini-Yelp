const Joi = require("joi");
const validateRequest = require("../../middlewares/validateRequest");

const validateCity = (req, res, next) => {
  const dataToValidate = { ...req.body };
  const schema = Joi.object({
    name: Joi.string().min(2).max(40).required(),
  });
  validateRequest(req, next, dataToValidate, schema);
};

const validateId = (req, res, next) => {
  const dataToValidate = { ...req.params };
  const schema = Joi.object({
    id: Joi.number().integer().required(),
  });
  validateRequest(req, next, dataToValidate, schema);
};

module.exports = {
  validateCity,
  validateId,
};
