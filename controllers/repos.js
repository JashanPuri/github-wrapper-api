const createRepo = (req, res, next) => {
  res.send("Create repository");
};

const getReposOfUser = (req, res, next) => {
  res.send("Get user repos");
};

const getRepoContributers = (req, res, next) => {
  res.send("Get repo contributers");
};

const getRepoStargazers = (req, res, next) => {
  res.send("Get repo contributers");
};

module.exports = {
  createRepo,
  getReposOfUser,
  getRepoContributers,
  getRepoStargazers,
};
