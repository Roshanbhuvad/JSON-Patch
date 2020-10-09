const express = require("express")
const imageController = require("../controllers/imageController")
const {
    verifyToken
} = require("../middleware/auth");

router.post("/create-thumbnail", verifyToken.imageController.create_thumbnail_post)

router.patch("/patch-object", verifyToken, imageController.patch_json_patch)

module.exports = router;