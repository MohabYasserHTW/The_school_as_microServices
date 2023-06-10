const {Router} = require("express")

const router = Router()

router.post("/:uid",require("../controllers/auth_controller").assignRoles)

module.exports = router