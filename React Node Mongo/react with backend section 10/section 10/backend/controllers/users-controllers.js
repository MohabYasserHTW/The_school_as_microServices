const { validationResult } = require('express-validator');
const bcrypt   = require("bcryptjs")
const HttpError = require('../models/http-error');
const User = require('../models/user');
const jwt = require("jsonwebtoken")

const getUsers = async (req, res, next) => {
  let users;
  try {
    
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    console.log("h")
    existingUser = await User.findOne({ email: email });
    console.log("h")
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }
  
  let hashedPw

  try{
    hashedPw = await   bcrypt.hash(password,12)
  }catch(e){
    return new HttpError("couldnt hash the password try again",500)
  }
  

  const createdUser = new User({
    name,
    email,
    image: 'http://localhost:5000/'+req.file.path,
    password: hashedPw,
    places: []
  });

  try {
    console.log(createdUser)
    await createdUser.save();
    
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  let token 
  try{
    token = jwt.sign({
      userId: createdUser.id,
      email: createdUser.email
    },
    "SECRET",
    {
        expiresIn: "1h"
    })
  }catch{
    return new HttpError("couldnt make the token ",500)
  }
  

  res.status(201).json({ userId: createdUser.id,email: createdUser.email,token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Loggin in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser ) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  let isValidPw = await bcrypt.compare(password,existingUser.password)

  try{

  }catch(e){
    return new HttpError("we cant log you in try agian later",500)
  }

  if(!isValidPw){
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  let token 
  try{
    token = jwt.sign({
      userId: existingUser.id,
      email: existingUser.email
    },
    "SECRET",
    {
        expiresIn: "1h"
    })
  }catch{
    return new HttpError("couldnt make the token ",500)
  }

  res.json({userId: existingUser.id,email: existingUser.email, token});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
