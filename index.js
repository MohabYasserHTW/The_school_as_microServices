const express = require("express")
const bodyParser = require("body-parser")
const axios = require("axios")
const { default: mongoose } = require("mongoose")

const app = express()

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
  });

app.use("/auth/login",require("./routes/login"))
app.use("/auth/signup",require("./routes/signup"))

app.use((req,res,next)=>{
    console.log(req.baseUrl,"ddd")
    res.status(404).json({message: "couldn't find this route"})
})


app.use((err,req,res,next)=>{
    if(res.headerSent){
        return next(err)
    }else{
        console.log(err)
        res.status(err.code)
        res.json({err:{message: err.message,code: err.code}})
    }
})


const dbURL = "mongodb+srv://mohabrageh3:WWVubZdw3MicNnQ1@authusers.mcokh4w.mongodb.net/"

mongoose.connect(dbURL)
.then(
    ()=>app.listen(5001,()=>{console.log("server working on port 5001")})
)
.catch((err)=>{
    console.log("couldn't connect to database :"+dbURL)
})