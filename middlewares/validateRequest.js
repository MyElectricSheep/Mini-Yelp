const validateRequest = async (req, next, dataToValidate, schema) => {
  // https://joi.dev/api/?v=17.4.1
  const options = {
    abortEarly: false, // when true, stops validation on the first error, otherwise returns all the errors found.
    allowUnknown: true, //  when true, allows object to contain unknown keys which are ignored.
    stripUnknown: true, // remove unknown elements from objects and arrays.
  };

  const { error, value } = await schema.validate(dataToValidate, options);

  if (error) {
    error.message = `Data validation error: ${error.details
      .map((x) => x.message)
      .join(", ")}`;
    next(error);
  } else {
    req.body = value;
    next();
  }
};

module.exports = validateRequest;
