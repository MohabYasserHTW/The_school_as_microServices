const express = require("express")
const examinstanceController = require("../controllers/exam-instance-controller")
const verify  = require("../middlewares/verify.js")

const router = express.Router()


router.post("/",verify,examinstanceController.addExamInstance)
router.get("/",verify,examinstanceController.getAllExamInstance)
router.get("/:id",verify,examinstanceController.getExamInstanceById)
router.delete("/:id",verify,examinstanceController.deleteExamInstance)
router.patch("/:id",verify,examinstanceController.updateExamInstancetByID)


module.exports = router