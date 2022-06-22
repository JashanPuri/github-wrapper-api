require("dotenv").config();
const express = require("express");

const reposRoutes = require("./routes/repos");
const stargazersRoutes = require("./routes/stargazers");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  // SETTING UP CORS HEADERS

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
});

app.get("/", (req, res, next) =>
  res.send("Cometlabs Assignment - Github API wrapper")
);

app.use("/api/v1/repos", reposRoutes);
app.use("/api/v1/stargazers", stargazersRoutes);

// handles routes that are not found
app.use(notFoundMiddleware);

// error handling middleware
app.use(errorHandlerMiddleware);

port = process.env.PORT || 3000;

const start = () => {
  try {
    app.listen(port, () => {
      console.log(`Server started listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
