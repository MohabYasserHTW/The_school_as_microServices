const express = require("express")
const bodyParser = require("body-parser")
const axios = require("axios")
const { default: mongoose } = require("mongoose")
var cors = require('cors');

const app = express()
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
  });
app.use(bodyParser.json());

app.use("/api/questions",require("./routes/question-route"))

app.use((req,res,next)=>{
    res.status(404).json({message: "couldn't find this route"})
})


app.use((err,req,res,next)=>{
    if(res.headerSent){
        return next(err)
    }else{
        res.status(err.code)
        res.json({message: err.message || "Unknown error ocuured"})
    }
})


const dbURL = "mongodb+srv://mohabrageh3:ODRy2Fht6UjdUCqW@questions.kpliyl5.mongodb.net/"

mongoose.connect(dbURL)
.then(
    ()=>app.listen(5002,()=>{console.log("server working on port 5002")})
)
.catch((err)=>{
    console.log("couldn't connect to database :"+dbURL)
})