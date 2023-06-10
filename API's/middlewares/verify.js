const HttpError = require("../models/httpError-model")
const jwt = require("jsonwebtoken")

const { ErrorsMessages } = require("../variables")
require('dotenv').config();
module.exports = (req,res,next)=>{
    if(req.method === "OPTIONS"){
        return next()
    }
    try{
        
        if(req.query.userType === "student"){
            const token = req.headers.authorization.split(" ")[1] 
        
        if(!token){
            next(new HttpError(ErrorsMessages.noToken ,401))
        }
        
        const decodedToken = jwt.verify(token,process.env.SECRET)
        req.userData = {userId: decodedToken.userId}
        next()
        }else{// if teacher
            const publicKey= process.env.KEY_CLOAK_PUB_KEY
            const token = req.headers.authorization.split(" ")[1] 
            
            if(!token){
                next(new HttpError(ErrorsMessages.noToken ,401))
            }
            const decodedToken =jwt.verify(token,publicKey) 
            const userType = decodedToken.realm_access.roles.find(r => r==="TEACHER" || r==="STUDENT" || r==="admin")
            req.userData = {userId: decodedToken.sub, userName:decodedToken.preferred_username, userType:userType}
            next()
        }
    }catch(err){
        
        return next(new HttpError(err ,401))
    }
    
}