const {Router} = require("express")

const router = Router()

router.post("/",require("../controllers/auth_controller").login)

module.exports = router