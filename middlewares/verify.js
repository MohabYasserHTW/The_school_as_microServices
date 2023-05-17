const HttpError = require("../models/httpError-model")
const jwt = require("jsonwebtoken")


module.exports = (req,res,next)=>{
    if(req.method === "OPTIONS"){
        return next()
    }
    try{
        const token = req.headers.authorization.split(" ")[1] 
        if(!token){
            next(new HttpError("auth failed no token " ,401))
        }
        const decodedToken = jwt.verify(token,"SECRET861999") 
        
        req.userData = {userId: decodedToken.userId, userName:decodedToken.userName, userType: decodedToken.userType}
        next()
    }catch{
        
        return next(new HttpError("auth failed    " ,401))
    }
    
}