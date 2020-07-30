const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const expressSanitizer = require("express-sanitizer");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
require("dotenv").config();

const userRouter = require("./routes/employee");
const feedRouter = require("./routes/feed");
const gifsRouter = require("./routes/gifs");
const articlesRouter = require("./routes/articles");

const app = express();

//HTTP headers
app.use(helmet());

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(expressSanitizer());
//xss attack -Data Sanitization
app.use(xss());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(hpp());

app.use("/v1/api/auth", userRouter);
app.use("/v1/api/feed", feedRouter);
app.use("/v1/api/gifs", gifsRouter);
app.use("/v1/api/articles", articlesRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to TeamWork",
  });
});

//Handling unhandle routes
app.all("*", (req, res) => {
  return res.status(404).json({
    status: "Error 404",
    message: `Url not found. Can't find ${req.originalUrl} on this server`,
  });
});

app.server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Running on port ${port}`);
});

module.exports = app;