const HttpError = require("../models/http-error")
const jwt = require("jsonwebtoken")
module.exports = (req,res,next)=>{
    if(req.method === "OPTIONS"){
        return next()
    }
    try{
        console.log("hhhhhh")
        const token = req.headers.authorization.split(" ")[1]//Authorization: "Bearer Token"
        console.log(token,"token")
        if(!token){
            next(new HttpError("auth failed no token " ,401))
        }
        const decodedToken = jwt.verify(token,"SECRET") // verfiy the token then get the data with that token
        req.userData = {userId: decodedToken.userId}
        next()
    }catch{
        
        return next(new HttpError("auth failed    " ,401))
    }
    

}