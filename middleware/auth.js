const jwt = require('jsonwebtoken')
const {
    JWT_SECRET
} = require("../config/key")

// Get the extension of a url/file
exports.fileExtension = (url) => {
    return url.split('.').pop().split(/\#|\?/)[0]
}

// Verify token
exports.verifyToken = (req, res, next) => {
    const {
        token
    } = req.headers

    if (!token) {
        return res.status(403).json({
            authorized: false,
            error: 'Token is required.'
        })
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                authorized: false,
                error: 'Verification failed or token has expired.'
            })
        }

        req.user = decoded
        next()
    })
}