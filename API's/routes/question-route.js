const { createQuestion, getQuestionById, getQuestions, updateQuestion, deleteAnswer, addAnswer, deleteQuestion } = require("../controllers/question-controller")
const express = require("express")
const router = express.Router()
const {check,expressValidator} = require("express-validator")
const verify = require("../middlewares/verify")



/* router.route("/user/:uId/category/:category")
.get(getQuestions)
router.route("/question/:qId")
.get(getQuestionById)
*/
router.route("/:qId")
.get(verify,getQuestionById)
.post(verify,addAnswer)
.delete(verify,deleteAnswer)
 

router.route("/")
.post([
    check("name").not().isEmpty(),
    check("category").not().isEmpty(),
    check("subCategory").not().isEmpty(),
    check("mark").not().isEmpty(),
    check("mark").isNumeric(),
    check("expectedTime").isNumeric(),
    check("answers").isArray(),
    check("answers").isLength({min:2}),
    check("correctAnswers").isLength({min:1}),
],
verify,
    createQuestion)
.get(verify,getQuestions)
.delete(verify,deleteQuestion)
.patch(
    [check("name").not().isEmpty(),
    check("category").not().isEmpty(),
    check("subCategory").not().isEmpty(),
    check("mark").not().isEmpty(),
    check("mark").isNumeric(),
    check("expectedTime").isNumeric(),
    check("answers").isArray(),
    check("answers").isLength({min:2}),
    check("correctAnswers").isLength({min:1})
],
verify,
updateQuestion) 


module.exports = router