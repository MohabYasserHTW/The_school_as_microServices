
const jwt = require("jsonwebtoken")
const HttpError = require("../models/httpError-model")
const Question = require("../models/question-model")
const { validationResult } = require('express-validator');


const verify = async (token) => {
    let verfied 
    try{
        verfied = jwt.verify(token,"SECRET861999")
        
        return {err:null,userId:verfied.userId, userName:verfied.userName,userType: verfied.userType}
        
    }catch{
        return {err:"Couldn't verify the token "}
    }
}

//tested
const createQuestion = async (req,res,next) => {
    const errors = validationResult(req) 
    const { name, category, subCategory, mark, expectedTime, answers, correctAnswers} = req.body
    let token 


    if(!errors.isEmpty()){
        return next(new HttpError(errors.array()[0].path+" Has : invalid value",400))
    }

    if(req.body.answers.length <2)
    {
        return next(new HttpError("answers must be 2 atleast ",400))
    }

    if(req.body.correctAnswers.length <1)
    {
        return next(new HttpError("correct answers must be 1 atleast ",400))
    }
    
    try{
        token = req.headers.authorization.split(" ")[1] 
        
    }catch{
        return next(new HttpError("Token required",400))
    }

    if(!token){
        return next(new HttpError("Token required",400))
    }


    const user = await verify(token)
    
    if(user.err ){
        return next(new HttpError("invalid token",403))
    }

    if(user.userType !== "TEACHER"){
        return next(new HttpError("only teachers can create questions ",403))
    }



    const question = new Question()

    question.name = name
    question.category = category
    question.subCategory = subCategory
    question.mark = mark 
    question.expectedTime = expectedTime
    question.answers = answers
    
    question.correctAnswers = correctAnswers.map(ans => question.answers[ans].id)
    
    question.createdBy = user.userId
    question.created_at = new Date().getDate()
    
    try{
        console.log(question)
        await question.save()
        res.status(201).json(question)
    }catch(err){
        console.log(err)
        return next(new HttpError("couldn't Save",501))
    }
    
}
//tested
const getQuestionById = async (req,res,next) =>{
    let token 
    let question
    const questionId = req.params.qId

    try{
        token = req.headers.authorization.split(" ")[1] 
        
    }catch{
        return next(new HttpError("Token required",400))
    }
    
    if(!token){
        return next(new HttpError("Token required",400))
    }


    const user = await verify(token)
    
    if(user.err ){
        return next(new HttpError("invalid token",403))
    }

    
    try{
        question = await Question.findById(questionId)
    }catch{
        return next(new HttpError("no question founded by this id ",404))
    }
    
    res.status(202).json(question)
}

//tested
const getQuestions = async (req,res,next) =>{
    const filters = req.query
    
    let token 
    let questions 

    try{
        token = req.headers.authorization.split(" ")[1] 
        
    }catch{
        return next(new HttpError("Token required",400))
    }
    
    if(!token){
        return next(new HttpError("Token required",400))
    }


    const user = await verify(token)
    
    if(user.err ){
        return next(new HttpError("invalid token",403))
    }

    if(user.userType === "STUDENT"){
        return next(new HttpError(" students not allowed to see this  ",403))
    }

    
    try{
        questions = await Question.find(filters)
    }catch{
        return next(new HttpError("no question found ",404))
    }

    res.status(202).json(questions)
}

//tested
const updateQuestion = async (req,res,next) => {
    const errors = validationResult(req)
    const { questionId, name, category, subCategory, mark, expectedTime, answers, correctAnswers} = req.body
    let token 
    let question
    if(!errors.isEmpty()){
        return next(new HttpError(errors.array()[0].path+" Has : invalid value",400))
    }

    if(req.body.answers.length <2)
    {
        return next(new HttpError("answers must be 2 atleast ",400))
    }

    if(req.body.correctAnswers.length <1)
    {
        return next(new HttpError("correct answers must be 1 atleast ",400))
    }


    try{
        token = req.headers.authorization.split(" ")[1] 
        
    }catch{
        return next(new HttpError("Token required",400))
    }

    if(!token){
        return next(new HttpError("Token required",400))
    }


    const user = await verify(token)
    
    if(user.err ){
        return next(new HttpError("invalid token",403))
    }

    
    try{
        question = await Question.findById(questionId)
        if(!question){
            return next(new HttpError("no question founded by this id ",404))
        }
    }catch{
        return next(new HttpError("no question founded by this id ",404))
    }


    if(user.userId !== question.createdBy){
        return next(new HttpError("only the user who created this question can reomve it",403))
    }

    
    question.name = name
    question.category = category
    question.subCategory = subCategory
    question.mark = mark 
    question.expectedTime = expectedTime
    question.answers = answers
    question.correctAnswers = correctAnswers.map(ans => question.answers[ans].id)

    try{
        console.log(question)
        await question.save()
        res.status(201).json(question)
    }catch{
        return next(new HttpError("couldn't Save",501))
    }

}
//tested
const deleteAnswer = async (req,res,next) => {
    const errors = validationResult(req)
    const {answerId} = req.body
    let token
    let question
    const questionId = req.params.qId


    if(!errors.isEmpty()){
        return next(new HttpError(errors.array()[0].path+" Has : invalid value",400))
    }

     
    try{
        token = req.headers.authorization.split(" ")[1] 
        
    }catch{
        return next(new HttpError("Token required",400))
    }
    
    
    if(!token){
        return next(new HttpError("Token required",400))
    }

    const user = await verify(token)
    
    if(user.err ){
        return next(new HttpError("invalid token",403))
    }

    
    try{
        question = await Question.findById(questionId).populate("answers").exec()
        if(!question){
            return next(new HttpError("no question founded by this id ",404))
        }
    }catch{
        return next(new HttpError("no question founded by this id ",404))
    }


    if(user.userId !== question.createdBy){
        return next(new HttpError("only the user who created this question can reomve it",403))
    }

    const answer =  question.answers.filter(answer => answer.id !== answerId)

    question.answers = answer

    try{
        await question.save()
        res.status(201).json(question)
    }catch{
        return next(new HttpError("couldn't Save",501))
    }
    
}
//tested
const addAnswer = async (req,res,next) => {
    const errors = validationResult(req)
    const {  answerName, answerDescription} = req.body
    let token 
    const questionId = req.params.qId
    let question

    if(!errors.isEmpty()){
        return next(new HttpError(errors.array()[0].path+" Has : invalid value",400))
    }

    
    try{
        token = req.headers.authorization.split(" ")[1] 
        
    }catch{
        return next(new HttpError("Token required",400))
    }
    
    if(!token){
        return next(new HttpError("Token required",400))
    }


    const user = await verify(token)
    
    if(user.err ){
        return next(new HttpError("invalid token",403))
    }

    
    try{
        question = await Question.findById(questionId).populate("answers").exec()
        if(!question){
            return next(new HttpError("no question founded by this id ",404))
        }
    }catch{
        return next(new HttpError("no question founded by this id ",404))
    }


    if(user.userId !== question.createdBy){
        return next(new HttpError("only the user who created this question can reomve it",403))
    }

    question.answers.push({name: answerName, description: answerDescription})

    try{
        await question.save()
        res.status(201).json(question)
    }catch{
        return next(new HttpError("couldn't Save",501))
    }
    
}
//tested
const deleteQuestion = async (req,res,next) => {
    const errors = validationResult(req)
    const { questionId} = req.body
    let token 
    let question


    if(!errors.isEmpty()){
        return next(new HttpError(errors.array()[0].path+" Has : invalid value",400))
    }


    try{
        token = req.headers.authorization.split(" ")[1] 
        
    }catch{
        return next(new HttpError("Token required",400))
    }
    if(!token){
        return next(new HttpError("Token required",400))
    }

    const user = await verify(token)

    if(user.userType !== "ADMIN"){
        return next(new HttpError("only Admin can reomve it",403))
    }

    
    try{
        question = await Question.findById(questionId).populate("answers").exec()
        if(!question){
            return next(new HttpError("no question founded by this id ",404))
        }
        question.deleteOne()
    }catch{
        return next(new HttpError("no question founded by this id ",404))
    }

    res.status(200).json("message: Deleted")

}

exports.createQuestion = createQuestion
exports.getQuestionById = getQuestionById
exports.getQuestions = getQuestions
exports.updateQuestion = updateQuestion
exports.deleteAnswer = deleteAnswer
exports.addAnswer = addAnswer
exports.deleteQuestion = deleteQuestion