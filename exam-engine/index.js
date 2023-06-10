const express = require("express")
const exam_defination_route = require("./routes/exam-defination")
const exam_instance_route = require("./routes/exam-instance-route");
const { ErrorsMessages } = require("./variables");
const app = express()
require('dotenv').config();



const port = process.env.PORT

app.use(express.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
  });
app.use("/exam/defination",exam_defination_route)
app.use("/exam/instance",exam_instance_route)

app.use((err,req,res,next)=>{
    
    if(res.headerSent){
        return next(err)
    }else{
        res.status(err.code)
        res.json({err: err.message || ErrorsMessages.unknownError})
    }
})

app.listen(port,()=>{
    console.log("examDB working on port "+port)
})