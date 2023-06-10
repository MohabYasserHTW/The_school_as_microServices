const {Router} = require("express")

const router = Router()


router.get("/",require("../controllers/auth_controller").getAllUsers);
router.get("/:role",require("../controllers/auth_controller").getUsersByRole);


module.exports = router