const { createQuestion, getQuestionById, getQuestions, updateQuestion, deleteAnswer, addAnswer, deleteQuestion } = require("../controllers/question-controller")
const express = require("express")
const router = express.Router()
const {check,expressValidator} = require("express-validator")




/* router.route("/user/:uId/category/:category")
.get(getQuestions)
router.route("/question/:qId")
.get(getQuestionById)
*/
router.route("/:qId")
.get(getQuestionById)
.post(addAnswer)
.delete(deleteAnswer)
 

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
    createQuestion)
.get(getQuestions)
.delete(deleteQuestion)
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
updateQuestion) 


module.exports = router