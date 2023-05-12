//Endpoint is like localhost:3000
//Parameter is the values you are passing throw the url (?param=hhhh) => localhost:3000/employee?id=5&type=employee
const express=require("express")
const app=express()

const https=require("https")
const PORT=3000

const bodyPareser=require("body-parser")
app.use(bodyPareser.urlencoded({extended:true}))


app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})

app.post("/",(req,res)=>{
    const weatherApiKey = "120803a83363649ebaa928bfecc86cbd";
    const unit = "metric";
    const api = "https://api.openweathermap.org/data/2.5/weather";
    const city = req.body.cityName;
    const url = `${api}?q=${city}&appid=${weatherApiKey}&units=${unit}`;


    https.get(url, (weatherRes) => {
    weatherRes.on("data", (data) => {

        const weatherData = JSON.parse(data);
        const temp = `<h1>The temperature on ${city} is ${weatherData.main.temp}</h1>`;
        const description = `<h2>The weather is currently ${weatherData.weather[0].description}</h2>`;
        const icon = weatherData.weather[0].icon;
        const iconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        const img = `<img src=${iconUrl} >`;

        res.send(`${description} ${temp} ${img}`);
    });
    });
})





app.listen(PORT,()=>{console.log("server launched on port 3000")})