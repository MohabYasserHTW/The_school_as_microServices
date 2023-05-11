const User = require("../models/user-model")
const bcrypt = require("bcryptjs")
const axios = require("axios")

const loginUser = async (req,res,next)=>{
    const userName = req.body.userName
    const password = req.body.password
    
    const user = await User.find({userName})
    
    if(!user.length){
        return next(new Error("wrong user name or password"))
    }

    const compare = await bcrypt.compare(password,user[0].password)
    if(!compare){        
        return next(new Error("wrong  password"))
    }
    console.log(user[0].toObject({getters:true}).id)
    await axios({
        method: "get",
        url: "http://localhost:5002/token",
        data: {
            userName,
            userId:user[0].toObject({getters:true}).id
        }
    })
    .then(data=>res.status(200).json({token: data.data.token}))
    .catch(err=>res.status(500).json({message:err.message})) 
    
}




const signupUser = async (req,res,next)=>{
    const userName = req.body.userName
    const password = req.body.password
    const usersFounded = await User.find({userName})
    if(usersFounded.length){
        return next(new Error(" user name already exist"))
    }

    const hashedPw = await bcrypt.hash(password,12)
    const user = new User()
    user.userName = userName
    user.password = hashedPw
    await user.save()

    console.log(user)

    await axios({
        method: "get",
        url: "http://localhost:5002/token",
        data: {
            userName,
            userId:user.toJSON({getters:true}).id
        }
    })
    .then(data=>res.status(201).json({token: data.data.token}))
    .catch(err=>res.status(500).json({message:err.message}))
}

exports.loginUser = loginUser
exports.signupUser = signupUser