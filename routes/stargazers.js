const express = require("express");

const isAuth = require("../middleware/auth");
const stargazersController = require("../controllers/stargazers");

const router = express.Router();

router.get("/", isAuth, stargazersController.getStargazers);

module.exports = router;
