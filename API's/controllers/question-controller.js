const HttpError = require("../models/httpError-model");
const Question = require("../models/question-model");
const { validationResult } = require("express-validator");
const { ErrorsMessages, Success } = require("../variables");
require("dotenv").config();

const createQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(ErrorsMessages.missingValues, 422));
  }

  const {
    name,
    category,
    subCategory,
    mark,
    expectedTime,
    answers,
    correctAnswers,
  } = req.body;

  if (req.body.answers.length < 2) {
    return next(new HttpError(ErrorsMessages.answersLessThan2, 422));
  }

  if (req.body.correctAnswers.length < 1) {
    return next(new HttpError(ErrorsMessages.correctAnswersLessThan1, 422));
  }

  const userData = req.userData;
  if (userData.userType !== "TEACHER") {
    return next(new HttpError(ErrorsMessages.forbbiden, 403));
  }

  const doubleName = await Question.find({ name: name });

  if (doubleName.length) {
    return next(new HttpError(ErrorsMessages.questionExist, 400));
  }

  const question = new Question();

  question.name = name;
  question.category = category;
  question.subCategory = subCategory;
  question.mark = mark;
  question.expectedTime = expectedTime;
  question.answers = answers;
  question.correctAnswers = correctAnswers.map(
    (ans) => question.answers[ans].id
  );
  question.createdBy = userData.userId;
  question.created_at = new Date().getDate();

  try {
    await question.save();
    res.status(201).json({ question: question, message: Success.created });
  } catch (err) {
    
    return next(new HttpError(ErrorsMessages.unknownError, 500));
  }
};

const getQuestionById = async (req, res, next) => {
  let question;
  const questionId = req.params.qId;

  try {
    question = await Question.findById(questionId);
  } catch {
    return next(new HttpError(ErrorsMessages.noDataFoundedByThisId, 404));
  }
  if (req.query.userType === "student") {
    question.correctAnswers = null;
  }
  
  res.status(202).json(question);
};

const getQuestions = async (req, res, next) => {
  const { filters } = req.query;
  const { pagination } = req.query;
  const userData = req.userData;

  if (userData.userType === "STUDENT") {
    return next(new HttpError(ErrorsMessages.forbbiden, 403));
  }

  let questions;
  let totalLength;
  try {
    
    questions = await Question.find(filters)
      .skip(pagination.skip)
      .limit(pagination.limit);
    
  } catch (err) {
    return next(new HttpError("no internet ", 400));
  }

  res.status(202).json({ questions, totalLength });
};

const updateQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(errors.array()[0].path + " Has : invalid value", 400)
    );
  }

  const {
    questionId,
    name,
    category,
    subCategory,
    mark,
    expectedTime,
    answers,
    correctAnswers,
  } = req.body;

  if (answers.length < 2) {
    return next(new HttpError(ErrorsMessages.answersLessThan2, 400));
  }

  if (correctAnswers.length < 1) {
    return next(new HttpError(ErrorsMessages.correctAnswersLessThan1, 400));
  }

  let question;

  try {
    question = await Question.findById(questionId);
    if (!question) {
      return next(new HttpError(ErrorsMessages.noDataFoundedByThisId, 404));
    }
  } catch {
    return next(new HttpError(ErrorsMessages.noDataFoundedByThisId, 404));
  }

  const userData = req.userData;
  if (userData.userId !== question.createdBy) {
    return next(new HttpError(ErrorsMessages.forbbiden, 403));
  }

  question.name = name;
  question.category = category;
  question.subCategory = subCategory;
  question.mark = mark;
  question.expectedTime = expectedTime;
  question.answers = answers;
  question.correctAnswers = correctAnswers;

  try {
    await question.save();
    res.status(201).json(question);
  } catch {
    return next(new HttpError(ErrorsMessages.unknownError, 501));
  }
};

const deleteAnswer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(errors.array()[0].path + " Has : invalid value", 400)
    );
  }

  const { answerId } = req.body;
  const questionId = req.params.qId;

  let question;
  try {
    question = await Question.findById(questionId).populate("answers").exec();
    if (!question) {
      return next(new HttpError(ErrorsMessages.noDataFoundedByThisId, 404));
    }
  } catch {
    return next(new HttpError(ErrorsMessages.noDataFoundedByThisId, 404));
  }

  const userData = req.userData;
  if (userData.userId !== question.createdBy) {
    return next(new HttpError(ErrorsMessages.forbbiden, 403));
  }

  const answers = question.answers.filter((answer) => answer.id !== answerId);

  question.answers = answers;

  try {
    await question.save();
    res.status(201).json(question);
  } catch {
    return next(new HttpError(ErrorsMessages.unknownError, 501));
  }
};

const addAnswer = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(errors.array()[0].path + " Has : invalid value", 400)
    );
  }

  const { answerName, answerDescription } = req.body;

  const questionId = req.params.qId;
  let question;

  try {
    question = await Question.findById(questionId);
    if (!question) {
      return next(new HttpError(ErrorsMessages.noDataFoundedByThisId, 404));
    }
  } catch {
    return next(new HttpError(ErrorsMessages.noDataFoundedByThisId, 404));
  }

  const userData = req.userData;
  if (userData.userId !== question.createdBy) {
    return next(new HttpError(ErrorsMessages.forbbiden, 403));
  }

  const newAnswer = question.answers.push({
    name: answerName,
    description: answerDescription,
  });

  try {
    await question.save();
    res.status(201).json(question.answers.pop());
  } catch {
    return next(new HttpError(ErrorsMessages.unknownError, 501));
  }
};

const deleteQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(errors.array()[0].path + " Has : invalid value", 400)
    );
  }

  const { questionId } = req.body;
  const userData = req.userData;

  if (userData.userType !== "ADMIN") {
    return next(new HttpError(ErrorsMessages.forbbiden, 403));
  }

  let question;
  try {
    question = await Question.findById(questionId).populate("answers").exec();
    if (!question) {
      return next(new HttpError(ErrorsMessages.noDataFoundedByThisId, 404));
    }
    question.deleteOne();
  } catch {
    return next(new HttpError(ErrorsMessages.noDataFoundedByThisId, 404));
  }

  res.status(200).json({ message: "Deleted" });
};

exports.createQuestion = createQuestion;
exports.getQuestionById = getQuestionById;
exports.getQuestions = getQuestions;
exports.updateQuestion = updateQuestion;
exports.deleteAnswer = deleteAnswer;
exports.addAnswer = addAnswer;
exports.deleteQuestion = deleteQuestion;
