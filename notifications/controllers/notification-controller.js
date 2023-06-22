
const Notification = require("../models/notification-model")


const getNotifications = async (req, res, next) => {
    const userData = req.userData;
    console.log(userData)

    
        console.log("dddsadsa")
        let notifications
        try {
            notifications = await Notification.find({madeTo:userData.userId})
            console.log(notifications,"dsdddddddddddddddddddddddddddad")
          } catch (err) {
            console.log(err)
            return next(new HttpError("no internet ", 400));
          }
          console.log(notifications,"dsad")
          res.status(202).json({ notifications });
    


}





exports.getNotifications = getNotifications;