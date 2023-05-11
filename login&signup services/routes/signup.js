const express = require("express")
const router = express.Router()
const {signupUser} = require("../controllers/user-controller")
const {check} = require("express-validator")


router.route("/")

.post([
    check("userName").not().isEmpty(),
    check("password").isLength({min: 6}),
    check("userType").isIn(["ADMIN","STUDENT","TEACHER"])
],
    signupUser)

module.exports = router