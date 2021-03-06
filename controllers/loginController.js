const jwt = require("jsonwebtoken");
const {
    body,
    validationResult
} = require("express-validator");
const {
    sanitizeBody
} = require("express-validator");
const {
    JWT_SECRET
} = require("../config/key");
require("dotenv").config();

exports.user_login_post = [
    // validating the input fields
    body("username", "Username required.")
    .isLength({
        min: 3,
    })
    .trim(),
    body("password", "Password must have at least 6 characters long").isLength({
        min: 6,
    }),

    // sanitize body with the wildcard
    sanitizeBody("*"),

    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).send({
                errors: errors.array(),
            });
        } else {
            const username = req.body.username.toLowerCase();
            const password = req.body.password;

            const token = jwt.sign({
                    username: username,
                },
                JWT_SECRET, {
                    expiresIn: 21600,
                }
            );

            req.headers["token"] = token;
            res.status(200).send({
                user: username,
                authorized: true,
                token: token,
            });
        }
    },
];