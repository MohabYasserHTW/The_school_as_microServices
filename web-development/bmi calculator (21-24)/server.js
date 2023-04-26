const express=require("express")
const app=express()

const bodyParser=require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))//to access the body 

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")

})

app.post("/",(req,res)=>{
    const result=Number(req.body.num1)+Number(req.body.num2)
    res.send("The result is "+result)
})

app.get("/bmicalculator",(req,res)=>{
    res.sendFile(__dirname + "/bmi.html");
})

app.post("/bmicalculator", (req, res) => {
    const weight=parseFloat(req.body.weight)
    const height=parseFloat(req.body.height)
    const result =weight / (height * height);
    res.send("Your BMI is: " + result);
});



app.listen(3000, () => {
  console.log("server started");
});