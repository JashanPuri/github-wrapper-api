const express = require("express");

const reposController = require("../controllers/repos");
const reposTopicsController = require("../controllers/repo-topics");
const isAuth = require("../middleware/auth");

const router = express.Router();

router.post("/", isAuth, reposController.createRepo);

router.get("/", isAuth, reposController.getReposOfUser);

router.get(
  "/:repoName/contributors",
  isAuth,
  reposController.getRepoContributors
);

router.get("/:repoName/stargazers", isAuth, reposController.getRepoStargazers);

router.get("/:repoName/topics", isAuth, reposTopicsController.getRepoTopics);

router.patch(
  "/:repoName/topics",
  isAuth,
  reposTopicsController.updateRepoTopics
);

router.delete(
  "/:repoName/topics",
  isAuth,
  reposTopicsController.deleteRepoTopics
);

module.exports = router;
