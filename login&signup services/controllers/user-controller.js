const User = require("../models/user-model")
const bcrypt = require("bcryptjs")
const axios = require("axios")
const jwt = require("jsonwebtoken")
const {getDataFromOtherService} = require("./data-controller")
const HttpError = require("../models/httpError-model")
const { validationResult } = require('express-validator');

const makeToken = async (userId, userName, userType) => {
    if(!userId || !userName || !userType){

        return {err:"Can't make token with missing field "}
        
    }
    let token 
    try{
        token = jwt.sign({
            userId,
            userName,
            userType
        },
        "SECRET861999",
        {
            expiresIn: "1h"
        })
    }catch(err){
        return {err:"Error on making the token"}
    }
    
    return {token,err:null}
}


const loginUser = async (req,res,next)=>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return next(new HttpError(errors.array()[0].value+" is: invalid value",400))
    }

    const {
        userName,
        password
    } = req.body

    const user = await User.find({userName})
    
    if(!user.length){
        return next(new HttpError("wrong user name or password",404))
    }

    const compare = await bcrypt.compare(password,user[0].password)
    if(!compare){        
        return next(new HttpError("wrong  password",401))
    }

    const tokenResult = await makeToken(user[0].toObject({getters:true}).id, userName, user[0].userType)
    
    if(tokenResult.err)
    {
        return next(new HttpError(tokenResult.err,500))
    }

    res.status(200).json({userType: user[0].userType,token: tokenResult.token})
}

const signupUser = async (req,res,next)=>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return next(new HttpError(errors.array()[0].value+" is: invalid value",400))
    }


    const {
        userName,
        password,
        userType
    } = req.body
    
    const usersFounded = await User.find({userName})

    if(usersFounded.length){
        return next(new HttpError(" user name already exist", 400))
    }

    let verfied
    if(userType === "ADMIN"){
        try{
            
            verfied = jwt.verify(req.body.token,"SECRET861999")
            
            if(verfied.userType !== "SUPER_ADMIN"){
                return next (new HttpError("only super admin can create admin",403))
            }
        }catch{
            return next(new HttpError("invalid token",403))
        }
    }
    

    const hashedPw = await bcrypt.hash(password,12)
    const user = new User()
    user.userName = userName
    user.password = hashedPw
    user.userType = userType
    await user.save()

    const tokenResult = await makeToken(user.toObject({getters:true}).id, userName, userType)
    if(tokenResult.err)
    {
        return next(new HttpError(tokenResult.err,500))
    }

    res.status(200).json({userType,token: tokenResult.token})

}

const getData = async (req,res,next) => {
    
    const {token} = req.body
    const data = await getDataFromOtherService(token)
    
    if(data.message){
        return next(new ErrorHttp(data.message,501))
    }

    res.status(200).json(data)
}

exports.loginUser = loginUser
exports.signupUser = signupUser
exports.getData = getData