const express=require("express")
const bodyParser=require("body-parser")
const { send } = require("process")

const app=express()
var items=[]
var workItems=[]

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.set("view engine","ejs")

app.get("/",(req,res)=>{
    let today=new Date()
    let day=""
    let options={
        weekday:"long",
        day:"numeric",
        month:"long"
    }

    day=today.toLocaleDateString("en-US",options)

    res.render("list",{kindOfDay:"Main",itemsList:items})
})

app.get("/work",(req,res)=>{
    res.render("list",{kindOfDay:"Work",itemsList:workItems})
})

app.post("/",(req,res)=>{
    console.log(req.body)
    if(req.body.list==="Work"){
        workItems.push(req.body.newItem)
        res.redirect("/work")
    }else{
        items.push(req.body.newItem)
        res.redirect("/")
    }
    
})



const PORT=3000
app.listen(PORT,()=>{
    console.log("server launched succefully ")
})