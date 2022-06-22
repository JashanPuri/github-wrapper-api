const CustomAPIError = require("../models/custom-api-error");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err.message === "Bad credentials") {
    err = new CustomAPIError(err.message, StatusCodes.UNAUTHORIZED);
  }
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ err: err.message || err });
};

module.exports = errorHandlerMiddleware;
