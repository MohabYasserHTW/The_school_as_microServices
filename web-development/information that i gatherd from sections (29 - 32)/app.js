const mongoose =require("mongoose")


/* Create or Open */
mongoose.connect("mongodb://localhost:27017/fruitsDB")
/* Create or Open */

/* make collection */
const fruitSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"this error cause no name specified for this fruit"]
    },
    rating:{//this called data validation
        type:Number,
        min:1,
        max:10
    },
    review:String
})
const humanSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"this error cause no name specified for this fruit"]
    },
    Age:{//this called data validation
        type:Number,
        min:1,
        max:100
    },
    favFruit:fruitSchema
})
const Human=mongoose.model("Human",humanSchema)
const Fruit=mongoose.model("Fruit",fruitSchema)
/* make collection */

/* Add */
const fruit1=new Fruit({
    name:"apple",
    rating:8,
    review:"Good"
})
//fruit1.save()

/* Add Many */
const fruit3=new Fruit({
    name:"Apple",
    rating:8,
    review:"Good"
})
const fruit2=new Fruit({
    name:"Apple",
    rating:8,
    review:"Good"
})
//Fruit.insertMany([fruit1,fruit2,fruit3])
/* Add Many */

/* Read */
Fruit.find().exec().then(data=>data.forEach(fruit=>console.log(fruit.name)))
/* Read */

/* update  */
Fruit.updateOne({name:"Apple"},{name:"New Apple"}).then()//didnt work untill i used then
/* update  */

/* delete  */
Fruit.deleteMany({name:"peach"}).then() // delete one works the same
/* delete  */

/* relation  */
const person=new Human({
    name:"Mohab",
    Age:"23",
    favFruit:fruit2
})
//person.save()
/* relation  */

/* close the connection*/
//mongoose.connection.close() //dont work correctly even when i put it on then
/* close the connection*/