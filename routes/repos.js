const express = require("express");

const reposController = require("../controllers/repos");
const reposTopicsController = require("../controllers/repo-topics");

router.post("/", reposController.createRepo);

router.get("/", reposController.getReposOfUser);

router.get("/:repoName/contribtuers", reposController.getRepoContributers);

router.get("/:repoName/stargazers", reposController.getRepoStargazers);

router.get("/:repoName/topics", reposTopicsController.getRepoTopics);

router.patch("/:repoName/topics", reposTopicsController.updateRepoTopics);

router.delete("/:repoName/topics", reposTopicsController.deleteRepoTopics);

const router = express.Router();

module.exports = router;
