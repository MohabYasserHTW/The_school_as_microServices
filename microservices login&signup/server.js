const express = require("express")
const bodyParser = require("body-parser")
const axios = require("axios")

const app = express()

app.use(bodyParser.json())




app.use("/api/users/login",(req,res,next)=>{
    axios.post("http://localhost:5001/login").then().catch(err=>{console.log(err)})
})

app.use("/api/users/signup",(req,res,next)=>{
    axios.post("http://localhost:5001/signup").then().catch(err=>console.log(err))
})

app.use("/",(req,res,next)=>{
    console.log(req.body)
})

/* app.use("/api/posts") */

app.use((req,res,next)=>{
    console.log("can find this route")
})

app.use((err,req,res,next)=>{
    if(res.headerSent){
        return next(err)
    }else{
        res.status(err.code || 500)
        res.json({message: err.message || "Unknown error ocuured"})
    }
})

app.listen(5000,()=>{console.log("server working on port 5000")})