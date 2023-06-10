const {Router} = require("express")
const controller = require("./controller")
const keycloaks = require('../../config/keycloack-config').initKeycloak();
const keycloak = require('../../config/keycloack-config').getKeycloak();


const router = Router()
router.use(keycloak.middleware())

console.log(keycloak)
router.get("/",controller.getUsers);
router.post("/",keycloak.protect("ADMIN"),controller.addUser);
router.get("/:id",controller.getUserbyId);
router.put("/:id",controller.editUser)
router.delete("/:id",controller.deleteUser);
module.exports = router