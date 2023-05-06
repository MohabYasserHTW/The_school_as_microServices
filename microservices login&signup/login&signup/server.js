const express = require("express")
const bodyParser = require("body-parser")
const axios = require("axios")
const { default: mongoose } = require("mongoose")

const app = express()

app.use(bodyParser.json());

app.use("/login",require("./routes/login"))
app.use("/signup",require("./routes/signup"))
app.use((req,res,next)=>{
    console.log("can't find this route")
})


app.use((err,req,res,next)=>{
    if(res.headerSent){
        return next(err)
    }else{
        res.status(500)
        res.json({message: err.message || "Unknown error ocuured"})
    }
})


const dbURL = "mongodb+srv://Mohab:Rgvug9hRonsUYPxT@microservice.zrifgax.mongodb.net"

mongoose.connect(dbURL)
.then(
    ()=>app.listen(5001,()=>{console.log("server working on port 5001")})
)
.catch((err)=>{
    console.log("couldn't connect to database :"+dbURL)
})