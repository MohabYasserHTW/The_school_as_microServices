const express = require("express")
const bodyParser = require("body-parser")

const { default: mongoose } = require("mongoose");
const { ErrorsMessages } = require("./variables");
require('dotenv').config();

const port = process.env.PORT

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
        res.json({message: err.message || ErrorsMessages.unknownError})
    }
})


const dbURL = process.env.DB_LINK

mongoose.connect(dbURL)
.then(
    ()=>app.listen(port,()=>{console.log("server working on port "+port)})
)
.catch((err)=>{
    console.log("couldn't connect to database :"+dbURL)
})