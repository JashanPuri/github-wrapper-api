const express = require("express");

const reposController = require("../controllers/repos");
const reposTopicsController = require("../controllers/repo-topics");

// isAuth middle ware checks for GIT personal access token
const isAuth = require("../middleware/auth");

const router = express.Router();

// create a repository for authenticated user
router.post("/", isAuth, reposController.createRepo);

// get repos for a user (includes filters for star count and fork count)
router.get("/", isAuth, reposController.getReposOfUser);

// get repos for a user with filtering based on commits
router.get(
  "/filter-with-commits",
  isAuth,
  reposController.filterReposWithCommits
);

// get repo contributors
router.get(
  "/:repoName/contributors",
  isAuth,
  reposController.getRepoContributors
);

// get repo stargazers
router.get("/:repoName/stargazers", isAuth, reposController.getRepoStargazers);

// get repository topics
router.get("/:repoName/topics", isAuth, reposTopicsController.getRepoTopics);

// update all respository topics
router.put("/:repoName/topics", isAuth, reposTopicsController.updateRepoTopics);

// delete all repository topics
router.delete(
  "/:repoName/topics",
  isAuth,
  reposTopicsController.deleteRepoTopics
);

module.exports = router;
