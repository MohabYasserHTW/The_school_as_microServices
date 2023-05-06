const express = require("express")
const router = express.Router()
const {loginUser} = require("../controllers/user-controller")

router.route("/")
.post(loginUser)
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