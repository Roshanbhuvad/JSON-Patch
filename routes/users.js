const express = require("express")
const userController = require("../controllers/loginController");

const router = express.Router();

router.post("/login", userController.user_login_post)

module.exports = router;