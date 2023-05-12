const multer = require("multer")
const uuid = require("uuid")

const MIME_TYPE_MAP = {
    "image/png" : "png",
    "image/jpg" : "jpg",
    "image/jpeg": "jpeg"
}

const fileUpload = multer({
    limits:500000,
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{

            cb(null,"uploads/imgs")
        },
        filename:(req,file,cb)=>{
            const ext = MIME_TYPE_MAP[file.mimetype]
            cb(null,uuid()+"."+ext)
        },
        fileFilter:(req,file,cb)=>{
            const isValid = !!MIME_TYPE_MAP[file.mimetype] // !! retrn true if exist and false if not
            let err = isValid ? null : new Error("invalid mime type")
            cb(err,isValid)
        }
    })
})

module.exports = fileUpload