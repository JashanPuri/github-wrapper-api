const Octokit = require("octokit").Octokit;

const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../models/custom-api-error");

const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      throw new CustomAPIError("Not authenticated");
    }

    const auth = authHeader.split(" ");
    if (auth.length != 2) {
      throw new CustomAPIError("Invalid Token Format");
    }

    const token = auth[1];

    const octokit = new Octokit({ auth: token });

    req.octokit = octokit;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAuth;
