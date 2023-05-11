const express = require("express")
const bodyParser = require("body-parser")
const axios = require("axios")

const app = express()

app.use(bodyParser.json())




app.use("/token",require("./routes/tokenRoutes"))



app.use((req,res,next)=>{
    res.json({message:"Can't find this route"})
})

app.use((err,req,res,next)=>{
    if(res.headerSent){
        return next(err)
    }else{
        res.status(err.code || 500)
        res.json({message: err.message || "Unknown error ocuured"})
    }
})

app.listen(5002,()=>{console.log("server working on port 5002")})