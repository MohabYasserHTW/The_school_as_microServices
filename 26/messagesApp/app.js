const express=require("express")
const bodyParser=require("body-parser")
const request=require("request")

const app=express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/singUp.html")
})

app.post("/",(req,res)=>{
    const firstName=req.body.firstName
    const secondName=req.body.secondName
    const email=req.body.email

    console.log(firstName,secondName,email)
})



/*
dfe3b4182f4fc5e33ba037b064b37813-us21 
*/
const PORT=3000
app.listen(PORT,()=>{
    console.log("server launched on port :"+PORT)
})
