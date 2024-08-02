const PrimaryErrorHandler = require("../utils/primary.error.handler");

const errorHandler = (err, req, res, next) => {
  let _statusCode = 500;

  let payload = {
    message: "Something Went Wrong",
    errorMessage: err.message,
  };

  // custom error messages
  if (err instanceof PrimaryErrorHandler) {
    statusCode = err.status;
    data = {
      message: err.message,
    };
  }

  return res.status(_statusCode).json(payload);
};

module.exports = errorHandler;