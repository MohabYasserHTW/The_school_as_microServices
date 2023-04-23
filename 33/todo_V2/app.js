const express=require("express")
const bodyParser=require("body-parser")
const { send } = require("process")
const mongoose=require("mongoose")
const _=require("lodash")
mongoose.connect("mongodb://localhost:27017/todoListDB")

const todoSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    }
})
const Item=mongoose.model("Item",todoSchema)
//Item.insertMany([new Item({title:"hahaha"}),new Item({title:"hhhhhhhhhh"})])

const app=express()

const listSchema=mongoose.Schema({
    name:String,
    items:[todoSchema]
})
const List=mongoose.model("List",listSchema)

//List.deleteMany().then()

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.set("view engine","ejs")

let day=""

app.get("/",(req,res)=>{
    let today=new Date()
    let options={
        weekday:"long",
        day:"numeric",
        month:"long"
    }

    day=today.toLocaleDateString("en-US",options)
    Item.find().then(items=>res.render("list",{type:"Main",itemsList:items,date:day}))
    
})

app.get("/:type",(req,res)=>{
    const type=_.capitalize(req.params.type)
    List.findOne({name:type}).then(list=>{
        if(list)
        res.render("list",{type:type,itemsList:list.items,date:day})
        else{
            const list=new List({
                name:type,
                items:[]
            })

            list.save()

            res.redirect("/"+type)
        }
    })
    
})

app.post("/",(req,res)=>{
    const item=new Item()
    item.title=req.body.newItem
    List.findOne({name:req.body.list}).then(list=>{
        list.items.push(item)
        list.save()
    })
    res.redirect("/"+req.body.list)
    
})

app.post("/delete",(req,res)=>{
    console.log(req.body,"ssssssss")
    const type=req.body.type
    if(type==="Main")
    {
        Item.deleteOne({_id:req.body.id}).then()
        res.redirect("/")
    }else{
        List.findOneAndUpdate({name:type},{$pull:{items:{_id:req.body.id}}}).then(res.redirect("/"+type))
    }
})


const PORT=3000
app.listen(PORT,()=>{
    console.log("server launched succefully ")
})