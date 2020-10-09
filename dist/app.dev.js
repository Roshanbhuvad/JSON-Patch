"use strict";

var express = require("express");

var path = require("path");

var logger = require("morgan");

var cookieParser = require("cookie-parser");

var bodyParser = require("body-parser");

var morgan = require("morgan");

var fs = require("fs");

var swaggerUi = require("swagger-ui-express");

var YAML = require("yamljs");

var swaggerDocument = YAML.load("./swagger.yaml");

var users = require("./routes/users");

var api = require("./routes/image");

var app = express();
var accessLogStream = fs.createWriteStream(path.join(__dirname, "hackerbay.log"), {
  flags: "a"
});
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express["static"](path.join(__dirname, "public")));
app.use(morgan("combined", {
  stream: accessLogStream
}));
app.use("/api", api);
app.use("/api/users", users);
app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(function (req, res, next) {
  /*const err = new Error("Not Found");
  err.status = 404;
  res.status(404).send({
    error: "Page does not exist", 
  }); */
});
app.use(function (err, req, res) {
  /*res.locals.error = req.app.get("env") === "development" ? err : {};
    //render the error page
  res.status(err.status || 500);
  res.render("error"); */
});
module.exports = app;