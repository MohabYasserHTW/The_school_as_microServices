const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error'); 

const app = express();

app.use(bodyParser.json());

app.use("/api/places",placesRoutes)//api/places work as a filter 
app.use("/api/users",usersRoutes)//api/places work as a filter 

app.use((req,res,next)=>{
    const err = new HttpError("couldn't find this route",404)
    throw err
})//it works if al the above routes executed and no response sent back 

app.use((err,req,res,next)=>{
    if(res.headerSent){// check if we already sent a response 
        return next(err)
    }else{
    res.status(err.code || 500) //send the error code or send 500
    res.json({message:err.message || "unknown error occured "})
    }
}) // this will work if there is any req with  4 params which means error
 // every req pass through all the above app.use and every app.use 
 //send the req,res,next to the next app.use and 
 //when any app.use has error it will send to the next app.use err,req,res,next and
 // here we are ready for the error

app.listen(5000,()=>{
    console.log("server started on port: 5000")
})