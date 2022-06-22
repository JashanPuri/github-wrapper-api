const { StatusCodes } = require("http-status-codes");
const cleanObject = require("../helpers/clean-object");
const CustomAPIError = require("../models/custom-api-error");

const createRepo = async (req, res, next) => {
  try {
    const octokit = req.octokit;

    const { name, description, private } = req.body;

    const response = await octokit.request("POST /user/repos", {
      name: name,
      description: description || "",
      private: private || true,
    });

    const repository = cleanObject(response);

    res.status(StatusCodes.CREATED).json({ repository });
  } catch (error) {}
};

const getReposOfUser = async (req, res, next) => {
  try {
    const octokit = req.octokit;

    const username = req.query.username;

    let response;

    if (username) {
      response = await octokit.request("GET /users/{username}/repos", {
        username: username.trim(),
      });
    } else {
      response = await octokit.request("GET /user/repos", {});
    }

    if (!response || !response.data) {
      throw new CustomAPIError("Repositories not found", StatusCodes.NOT_FOUND);
    }

    const repos = [];

    for (var i = 0; i < response.data.length; i++) {
      repos.push(cleanObject(response.data[i]));
    }

    res.status(StatusCodes.OK).json({ count: repos.length, repos });
  } catch (error) {
    next(error);
  }
};

const getRepoContributors = async (req, res, next) => {
  try {
    const octokit = req.octokit;

    const repoName = req.params.repoName;
    let username = req.query.username;

    if (!username) {
      const resp = await octokit.request("GET /user", {});
      username = resp.data.login;
    }

    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contributors",
      {
        owner: username,
        repo: repoName,
      }
    );

    const contributers = [];

    for (var i = 0; i < response.data.length; i++) {
      contributers.push(cleanObject(response.data[i]));
    }

    res
      .status(StatusCodes.OK)
      .json({ count: contributers.length, contributers });
  } catch (error) {
    next(error);
  }
};

const getRepoStargazers = async (req, res, next) => {
  try {
    const octokit = req.octokit;

    const repoName = req.params.repoName;
    let username = req.query.username;

    if (!username) {
      const resp = await octokit.request("GET /user", {});
      username = resp.data.login;
    }

    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/stargazers",
      {
        owner: username,
        repo: repoName,
      }
    );

    const stargazers = [];

    for (var i = 0; i < response.data.length; i++) {
      stargazers.push(cleanObject(response.data[i]));
    }

    res.status(StatusCodes.OK).json({ count: stargazers.length, stargazers });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRepo,
  getReposOfUser,
  getRepoContributors,
  getRepoStargazers,
};
