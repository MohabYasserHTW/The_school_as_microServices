const express = require("express")
const app = express()
const runConsumer = require("./consumer/index")
const { default: mongoose } = require("mongoose");
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
  });
  
  
  app.use("/notifications",require("./routes/notification-route"))
  
  app.use((req,res,next)=>{
    res.status(404).json({message: "couldn't find this route"})
  })

  runConsumer()
  const dbURL = "mongodb+srv://mohabrageh3:xmCGCF8V4NcDM3uE@notification.wmkfujz.mongodb.net/"




mongoose.connect(dbURL)
.then(
    ()=>app.listen(6070,()=>{console.log("server working on port "+6070)})
)
.catch((err)=>{
    console.log(err)
})