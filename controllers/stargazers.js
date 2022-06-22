const { StatusCodes } = require("http-status-codes");
const cleanObject = require("../helpers/clean-object");

const getStargazers = async (req, res, next) => {
  try {
    const octokit = req.octokit;

    const stargazersCount = {};

    const filters = req.query.filters;
    const username = req.query.username;

    let response;

    if (username) {
      response = await octokit.request("GET /users/{owner}/repos", {
        owner: username,
        affiliation: "owner",
      });
    } else {
      response = await octokit.request("GET /user/repos", {
        affiliation: "owner",
      });
    }

    for (var i = 0; i < response.data.length; i++) {
      if (response.data[i].stargazers_count === 0) continue;

      const stargazersResp = await octokit.request(
        "GET /repos/{owner}/{repo}/stargazers",
        {
          owner: response.data[i].owner.login,
          repo: response.data[i].name,
        }
      );
      for (var j = 0; j < stargazersResp.data.length; j++) {
        const stargazer = stargazersResp.data[j].login;
        if (stargazer in stargazersCount) {
          stargazersCount[stargazer][0] += 1;
        } else {
          stargazersCount[stargazer] = [1, cleanObject(stargazersResp.data[j])];
        }
      }
    }
    const stargazers = [];

    let filter = "stargazersCount[stargazer][0] >= 1";

    if (filters) {
      const starFilter = filters
        .split(",")
        .filter((fil) => fil.startsWith("stars"));

      if (starFilter.length > 0) {
        const exp = starFilter[0].slice(5);
        filter = "stargazersCount[stargazer][0]" + `${exp}`;
      }
    }

    for (var stargazer in stargazersCount) {
      if (eval(filter)) {
        stargazers.push(stargazersCount[stargazer][1]);
      }
    }

    res.status(StatusCodes.OK).json({ count: stargazers.length, stargazers });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStargazers };
