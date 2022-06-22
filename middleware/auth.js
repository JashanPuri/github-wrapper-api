const Octokit = require("octokit").Octokit;

const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../models/custom-api-error");

// checking for GIT PAT
const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      throw new CustomAPIError("Not authenticated");
    }

    // token must be of the format "Bearer <token>"
    const auth = authHeader.split(" ");
    if (auth.length != 2) {
      throw new CustomAPIError("Invalid Token Format");
    }

    const token = auth[1];

    // initilaizing octokit with git personal access token
    const octokit = new Octokit({ auth: token });

    // storing the octokit object in req object for passing on
    req.octokit = octokit;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAuth;
