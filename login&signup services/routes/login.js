const express = require("express")
const router = express.Router()
const {loginUser} = require("../controllers/user-controller")
const {check} = require("express-validator")

router.route("/")
.post([
    check("userName").not().isEmpty(),
    check("password").not().isEmpty()
],
    loginUser)


module.exports = router