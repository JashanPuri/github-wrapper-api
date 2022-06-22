const express = require("express");

const reposController = require("../controllers/repos");
const reposTopicsController = require("../controllers/repo-topics");
const isAuth = require("../middleware/auth");

const router = express.Router();

router.post("/", isAuth, reposController.createRepo);

router.get("/", isAuth, reposController.getReposOfUser);

router.get(
  "/filter-with-commits",
  isAuth,
  reposController.filterReposWithCommits
);

router.get(
  "/:repoName/contributors",
  isAuth,
  reposController.getRepoContributors
);

router.get("/:repoName/stargazers", isAuth, reposController.getRepoStargazers);

router.get("/:repoName/topics", isAuth, reposTopicsController.getRepoTopics);

router.put("/:repoName/topics", isAuth, reposTopicsController.updateRepoTopics);

router.delete(
  "/:repoName/topics",
  isAuth,
  reposTopicsController.deleteRepoTopics
);

module.exports = router;
