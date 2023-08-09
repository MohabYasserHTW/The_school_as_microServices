const express = require("express")

const examDefinationController = require("../controllers/exam-defination-controller.js")
const verify = require("../middlewares/verify.js")
const router = express.Router()

router.get("/",verify,examDefinationController.getExamsDefinations)
router.post("/",verify,examDefinationController.addExamDefination)
router.patch("/:id",verify,examDefinationController.updateExamDefination)
router.get("/:id",verify,examDefinationController.getExamDefinationById)
router.delete("/:id",verify,examDefinationController.deleteExamDefinationById)

module.exports = router