const express = require("express")
const router = express.Router()



router.route("/")
.post(require("../controllers/user-controller").signupUser)
.get((req,res,next)=>{
    console.log("get")
})
.delete((req,res,next)=>{
    console.log("delete")
})
.patch((req,res,next)=>{
    console.log("patch")
})


module.exports = router