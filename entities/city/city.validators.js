const Joi = require("joi");
const validateRequest = require("../../middlewares/validateRequest");

const validateNewCity = (req, res, next) => {
  const dataToValidate = { ...req.body };
  const schema = Joi.object({
    name: Joi.string().min(2).max(40).required(),
  });
  validateRequest(req, next, dataToValidate, schema);
};

const validateUpdateCity = (req, res, next) => {
  const dataToValidate = { ...req.body, ...req.params };
  const schema = Joi.object({
    name: Joi.string().min(2).max(40).required(),
    id: Joi.number().integer().required(),
  });
  validateRequest(req, next, dataToValidate, schema);
};

module.exports = {
  validateNewCity,
  validateUpdateCity,
};
