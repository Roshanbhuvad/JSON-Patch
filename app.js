const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");

const users = require("./routes/users");
const api = require("./routes/image");

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  morgan("combined", {
    stream: accessLogStream,
  })
);

app.use("/api", api);
app.use("/api/users", users);

app.use((req, res, next) => {
  /*const err = new Error("Not Found");
  err.status = 404;
  res.status(404).send({
    error: "Page does not exist",
  }); */
});

app.use((err, req, res) => {
  /*res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
 
  //render the error page
  res.status(err.status || 500);
  res.render("error"); */
});
app.listen(5000, () => {
  console.log("Server started at http://localhost:5000");
});

module.exports = app;
