const express=require("express")
const app=express()
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/wikiDB")

const articleSchema=mongoose.Schema({
    title:String,
    content:String
})
const Article=mongoose.model("Article",articleSchema)

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.route("/articles")
.get((req,res)=>{
    Article.find().then(articles=>{
        res.send(articles)
    })
})
.post((req,res)=>{
    const title=req.body.title
    const content=req.body.content
    const newArticle=new Article()

    newArticle.title=title
    newArticle.content=content
    newArticle.save()
})
.delete((req,res)=>{
    Article.deleteMany().then()
    
});

app.route("/articles/:articleTitle")
.get((req,res)=>{
    const articleTitle=req.params.articleTitle

    Article.findOne({title:articleTitle}).then(article=>{
        res.send(article)
    })
})
.put((req,res)=>{
    const articleTitle=req.params.articleTitle
    const newContent=req.body.content
    const newTitle=req.body.title
    Article.updateOne(
        {title:articleTitle},
        {content:newContent,title:newTitle},
        {overWrite:true}
    ).then()
})
.patch((req,res)=>{
    const articleTitle=req.params.articleTitle
    
    Article.updateOne(
        {title:articleTitle},
        {$set:req.body},
        {overWrite:true}
    ).then()
})
.delete((req,res)=>{
    const articleTitle=req.params.articleTitle

    Article.deleteOne({title:articleTitle}).then()
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });