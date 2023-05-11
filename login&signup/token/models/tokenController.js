const { validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")


const makeToken = async (req,res,next) => {
    console.log("1")
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next( new Error("userId or userName is Empty"))
    }

    const {userId, userName} = req.body
    console.log("2")
    let token 
    try{
        token = jwt.sign({
            userId,
            userName
        },
        "SECRET861999",
        {
            expiresIn: "1h"
        })
    }catch{
        return next( new Error("Couldn't create the token !!"))
    }
    console.log(token,"ddddddd")
    res.status(201).json({token})
}

exports.makeToken = makeToken