const { StatusCodes } = require("http-status-codes");

const getRepoTopics = async (req, res, next) => {
  try {
    const octokit = req.octokit;

    const repoName = req.params.repoName;
    let owner = req.query.owner;

    if (!owner) {
      const resp = await octokit.request("GET /user", {});
      owner = resp.data.login;
    }

    const response = await octokit.request("GET /repos/{owner}/{repo}/topics", {
      owner: owner,
      repo: repoName,
    });

    const topics = response.data.names;

    res.status(StatusCodes.OK).json({ count: topics.length, topics });
  } catch (error) {
    next(error);
  }
};

const updateRepoTopics = async (req, res, next) => {
  try {
    const octokit = req.octokit;

    const repoName = req.params.repoName;
    let owner = req.params.owner;

    const topics = req.body.topics || [];

    if (!owner) {
      const resp = await octokit.request("GET /user", {});
      owner = resp.data.login;
    }

    await octokit.request("PUT /repos/{owner}/{repo}/topics", {
      owner: owner,
      repo: repoName,
      names: topics,
    });

    res.status(StatusCodes.OK).send();
  } catch (error) {
    next(error);
  }
};

const deleteRepoTopics = async (req, res, next) => {
  try {
    const octokit = req.octokit;

    const repoName = req.params.repoName;
    let owner = req.params.owner;

    const topics = [];

    if (!owner) {
      const resp = await octokit.request("GET /user", {});
      owner = resp.data.login;
    }

    await octokit.request("PUT /repos/{owner}/{repo}/topics", {
      owner: owner,
      repo: repoName,
      names: topics,
    });

    res.status(StatusCodes.OK).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getRepoTopics, updateRepoTopics, deleteRepoTopics };
