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
    const affiliation = req.query.affiliation || "owner";
    const filters = req.query.filters;

    let response;

    if (username) {
      response = await octokit.request("GET /users/{owner}/repos", {
        owner: username,
        affiliation: affiliation,
      });
    } else {
      response = await octokit.request("GET /user/repos", {
        affiliation: affiliation,
      });
    }

    if (!response || !response.data) {
      throw new CustomAPIError("Repositories not found", StatusCodes.NOT_FOUND);
    }

    let starFilter = "response.data[i].stargazers_count >= 0";
    let forksFilter = "response.data[i].forks_count >= 0";

    if (filters) {
      const filterList = filters.split(",");
      const starList = filterList.filter((filter) =>
        filter.startsWith("stars")
      );
      const forkList = filterList.filter((filter) =>
        filter.startsWith("forks")
      );

      if (starList.length > 0) {
        starFilter = "response.data[i].stargazers_count" + starList[0].slice(5);
      }

      if (starList.length > 0) {
        starFilter = "response.data[i].forks_count" + forkList[0].slice(5);
      }
    }

    const repos = [];

    for (var i = 0; i < response.data.length; i++) {
      if (!eval(starFilter)) continue;

      if (!eval(forksFilter)) continue;

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
