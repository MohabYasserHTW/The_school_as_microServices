const {Router} = require("express")

const router = Router()

router.post("/",require("../controllers/auth_controller").logout)

module.exports = router