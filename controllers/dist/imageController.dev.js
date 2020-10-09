"use strict";

var _require = require("express-validator"),
    body = _require.body,
    validationResult = _require.validationResult;

var sharp = require("sharp");

var download = require("image-downloader");

var jsonpatch = require("fast-json-patch");

var _require2 = require("../middleware/auth"),
    fileExtension = _require2.fileExtension;

var imageTypes = ["jpg", "tif", "gif", "png", "svg"];

exports.create_thumbnail_post = function (req, res, next) {
  var imageUrl = req.body.imageUrl;
  var imageUrlExt = fileExtension(imageUrl).toLowerCase();

  if (imageTypes.includes(imageUrlExt)) {
    var options = {
      url: imageUrl,
      dest: "./public/images/original/"
    };
    var resizeFolder = "./public/images/resized/";
    download.image(options).then(function (_ref) {
      var filename = _ref.filename;
      sharp(filename).resize(50, 50).toFile("".concat(resizeFolder, "output.").concat(imageUrlExt), function (err) {
        if (err) {
          return next(err);
        }

        return res.json({
          converted: true,
          user: req.user.username,
          success: "Image has been resized",
          thumbnail: resizeFolder
        });
      });
    })["catch"](function () {
      res.status(400).json({
        error: "Something went wrong. kindly check your image url and try again"
      });
    });
  } else {
    res.status(400).json({
      error: "We only handle image files with extensions - ".concat([].concat(imageTypes))
    });
  }
};

exports.patch_json_patch = [// Validate input fields. Trim spaces around username
body('jsonObject', 'JSON object must not be empty.').isLength({
  min: 1
}), body('jsonPatchObject', 'JSON patch object must not be empty.').isLength({
  min: 1
}), function (req, res, next) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  var jsonObject = JSON.parse(req.body.jsonObject);
  var jsonPatchObject = JSON.parse(req.body.jsonPatchObject);
  var patchedObject = jsonpatch.applyPatch(jsonObject, jsonPatchObject).newDocument;
  res.json({
    patchedObject: patchedObject
  });
}];