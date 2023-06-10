const mongoose = require("mongoose")

const Schemaa = mongoose.Schema

const ansewerSchema = new Schemaa({
    name: {type: String, required: true},
    description: {type: String}
})
const Answer = mongoose.model("Answer", ansewerSchema)
const questionSchema = new Schemaa({
    name: {type: String, required: true},
    category: {type: String, required: true},
    subCategory: {type: String, required: true, },
    mark: {type: Number, required: true, },
    expectedTime: {type: Number, required: true, },
    correctAnswers: [{
        type:mongoose.Types.ObjectId,
        required: true,
        ref: "Answer"
    }],
    createdBy: {type: String, required: true, },
    created_at: {type: Date},
    answers: [ansewerSchema]
    
})

module.exports = mongoose.model("Question", questionSchema)