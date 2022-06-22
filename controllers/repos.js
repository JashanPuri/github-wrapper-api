const { StatusCodes } = require("http-status-codes");
const cleanObject = require("../helpers/clean-object");
const CustomAPIError = require("../models/custom-api-error");

const createRepo = async (req, res, next) => {
  try {
    const octokit = req.octokit;

    const { name, description, private } = req.body;

    // creating the repo for the user
    const response = await octokit.request("POST /user/repos", {
      name: name,
      description: description || "",
      private: private || true,
    });

    // cleaning the object
    const repository = cleanObject(response);

    res.status(StatusCodes.CREATED).json({ repository });
  } catch (error) {}
};

const getReposOfUser = async (req, res, next) => {
  try {
    const octokit = req.octokit;

    const username = req.query.username;

    // affiliation defines which all repos should be included
    // like owner means - only those repos will be included in which the user is an owner
    // values accepted = owner, collaborator, organization_member
    // can be passed as a list of comma-seperated values
    const affiliation = req.query.affiliation || "owner";

    // filters for number of stars and forks
    // example - filters=stars>=5&forks>=5
    // OR filters=stars==5 or any valid expression as such
    // double equal-to signs for equality
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

    // creating filter expressions for forks and stars
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

      if (forkList.length > 0) {
        starFilter = "response.data[i].forks_count" + forkList[0].slice(5);
      }
    }

    const repos = [];

    // applying filtering and adding the repo as a cleaned object
    // if no filters are passed every repo is taken
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

    // getting the repository contributers
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

    // getting the repository stargazers
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

const filterReposWithCommits = async (req, res, next) => {
  try {
    const octokit = req.octokit;

    // QUERY PARAMETER:

    const username = req.query.username;

    // filters for number of commits
    // example - filters=commits>5 for greater than 5 commits
    // OR filters=commits==5 or any valid expression as such
    // double equal-to signs for equality
    const filters = req.query.filters;

    // same as defined above in getReposOfUser
    const affiliation = req.query.affiliation;

    // boolean value indicating if
    // commits to be counted should be made by owner or not
    const byOwner = req.query.byOwner || false;

    // number of days since the commits should be counted
    // days = 10 means commits of last 10 days
    let days = req.query.days || 10;

    if (typeof days === "string") {
      days = Number.parseInt(days);
    }

    let commitsSince = new Date();
    commitsSince.setDate(commitsSince.getDate() - days);
    commitsSince.setHours(0);
    commitsSince.setMinutes(0);
    commitsSince.setSeconds(0);
    commitsSince = commitsSince.toISOString();

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

    let commitsFilter = "commits.data.length >= 5";

    // creating filter for number of commits
    if (filters) {
      const filterList = filters.split(",");
      const commitFilterList = filterList.filter((filter) =>
        filter.startsWith("commits")
      );
      if (commitFilterList.length > 0) {
        commitsFilter = "commits.data.length" + commitFilterList[0].slice(7);
      }
    }

    const repos = [];

    // applying filtering and cleaning and getting the repos
    for (var i = 0; i < response.data.length; i++) {
      let commits;
      try {
        // getting the commits of the repo
        commits = await octokit.request("GET /repos/{owner}/{repo}/commits", {
          owner: response.data[i].owner.login,
          repo: response.data[i].name,
          since: commitsSince,
          author: byOwner ? response.data[i].owner.login : undefined,
        });
      } catch (error) {
        continue;
      }

      if (!eval(commitsFilter)) continue;

      repos.push(cleanObject(response.data[i]));
    }

    res.status(StatusCodes.OK).json({ count: repos.length, repos });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  createRepo,
  getReposOfUser,
  getRepoContributors,
  getRepoStargazers,
  filterReposWithCommits,
};
