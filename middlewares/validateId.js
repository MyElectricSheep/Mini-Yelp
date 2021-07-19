const Joi = require("joi");
const validateRequest = require("./validateRequest");

const validateId = (req, res, next) => {
  const dataToValidate = { ...req.params };
  const schema = Joi.object({
    id: Joi.number().integer().required(),
  });
  validateRequest(req, next, dataToValidate, schema);
};

module.exports = { validateId };
