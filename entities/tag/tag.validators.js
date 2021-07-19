const Joi = require("joi");
const validateRequest = require("../../middlewares/validateRequest");

const validateTag = (req, res, next) => {
  const dataToValidate = { ...req.body };
  const schema = Joi.object({
    name: Joi.string().min(2).max(80).required(),
  });
  validateRequest(req, next, dataToValidate, schema);
};

module.exports = {
  validateTag,
};
