const express = require("express");
const { errorMessages } = require("./variables");
require('dotenv').config();

const app = express()
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

app.use("/register",require("./routes/register"))
app.use("/login",require("./routes/login"))
app.use("/users",require("./routes/users"))
app.use("/logout",require("./routes/logout"))
app.use("/refreshtoken",require("./routes/refreshToken"))


app.use((err,req,res,next)=>{
    if(res.headerSent){
        return next(err)
    }else{
        res.status(err.code)
        res.json({message: err.message || errorMessages.unknownError})
    }
})

app.listen(port,()=>{
    console.log("app launched on port "+port)
})