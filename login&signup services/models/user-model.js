const mongoose = require("mongoose")

const Schemaa = mongoose.Schema

const userSchema = new Schemaa({
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    userType: {type: String, required: true, }
})

module.exports = mongoose.model("User", userSchema)