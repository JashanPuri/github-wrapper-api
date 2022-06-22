const express = require("express");

const isAuth = require("../middleware/auth");
const stargazersController = require("../controllers/stargazers");

const router = express.Router();

// get all stargazers for a particular user
router.get("/", isAuth, stargazersController.getStargazers);

module.exports = router;
