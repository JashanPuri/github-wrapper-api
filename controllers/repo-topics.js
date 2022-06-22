const { StatusCodes } = require("http-status-codes");

const getRepoTopics = async (req, res, next) => {
  try {
    const octokit = req.octokit;

    const repoName = req.params.repoName;
    let username = req.query.username;

    if (!username) {
      const resp = await octokit.request("GET /user", {});
      username = resp.data.login;
    }

    // getting the topics of the repo
    const response = await octokit.request("GET /repos/{owner}/{repo}/topics", {
      owner: username,
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
    let username = req.params.username;

    const topics = req.body.topics || [];

    if (!username) {
      const resp = await octokit.request("GET /user", {});
      username = resp.data.login;
    }

    // updating the topics
    await octokit.request("PUT /repos/{owner}/{repo}/topics", {
      owner: username,
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
    let username = req.params.username;

    const topics = [];

    if (!username) {
      const resp = await octokit.request("GET /user", {});
      username = resp.data.login;
    }

    // deleting the topics
    await octokit.request("PUT /repos/{owner}/{repo}/topics", {
      owner: username,
      repo: repoName,
      names: topics,
    });

    res.status(StatusCodes.OK).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getRepoTopics, updateRepoTopics, deleteRepoTopics };
