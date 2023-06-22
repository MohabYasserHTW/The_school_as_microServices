const mongoose = require("mongoose")

const Schemaa = mongoose.Schema

const notificationSchema = new Schemaa({
    examName: {type: String, required: true},
    timestamp: {type: Date},
    url: {type: String},
    notificationType: {type: String, required: true },
    madeTo: {type: String},
    madeBy: {type: String}
})


module.exports = mongoose.model("Notification", notificationSchema)