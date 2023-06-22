const express = require("express")
const router = express.Router()
const notificationsController = require("../controllers/notification-controller")
const verify = require("../middlewares/verify")

router.get("/",verify,notificationsController.getNotifications)

module.exports = router