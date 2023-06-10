const {Router} = require("express")

const router = Router()

router.post("/",require("../controllers/auth_controller").refresh_token)

module.exports = router