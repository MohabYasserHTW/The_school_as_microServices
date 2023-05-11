const express = require("express")
const { check } = require('express-validator')
const router = express.Router()
const {makeToken} = require("../models/tokenController")

router.get("/",[
    check("userId").not().isEmpty(),
    check("userName").not().isEmpty()
],makeToken)

module.exports = router