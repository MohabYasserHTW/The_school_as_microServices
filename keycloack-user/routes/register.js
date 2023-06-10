const {Router} = require("express")

const router = Router()


router.post("/",require("../controllers/auth_controller").register);


module.exports = router