const User = require("../models/user-model")
const bcrypt = require("bcryptjs")


const loginUser = async (req,res,next)=>{
    const userName = req.body.userName
    const password = req.body.password
    
    const user = await User.find({userName})
    
    if(!user.length){

        return next(new Error("wrong user name or password"))
    }else{
        const compare = await bcrypt.compare(password,user[0].password)
        if(compare){
    
            res.status(400).json({user/* :user.toObject({getters:true}) */})
        }
        else{
    
            return next(new Error("wrong  password"))
        }
    }
}




const signupUser = async (req,res,next)=>{
    const userName = req.body.userName
    const password = req.body.password
    const user = await User.find({userName})
    if(!user.length){
        const hashedPw = await bcrypt.hash(password,12)
        const user = new User()
        user.userName = userName
        user.password = hashedPw

        await user.save()
        
        res.status(201).json({message: "user created successfully "})
    }else{
        return next(new Error(" user name already exist"))
    }
}

exports.loginUser = loginUser
exports.signupUser = signupUser