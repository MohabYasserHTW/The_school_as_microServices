require('dotenv').config();
const adminLogin = {
    username: process.env.ADMIN_USER_NAME,
    password: process.env.ADMIN_PASSWORD,
    grant_type: "password",
    client_id: "my_client",
    client_secret: "bNPw927DKtV2D7hj4qTYIIUndUtfwGqE"
}
const userLogin = {
    grant_type: "password",
    client_id: "my_client",
    client_secret: "bNPw927DKtV2D7hj4qTYIIUndUtfwGqE"
}

const roles = {
    student: {
        name: "STUDENT",
        id: "94e6dbce-6bde-49e8-9fc7-c39a19be6b54"
    },
    teacher: {
        name: "TEACHER",
        id: "3ad902b1-46fd-4700-91e0-534682c98a92"
    }
}

const errorMessages = {
    unknownError: "Unknown error ocuured",
    couldnotSetRoles: "user created without setting his roles pls talk with the admin",
    wrong_userName_Passwrod: "wrong user name or password",
    keyCloack_Not_Working: "keycloak not working",
    invalid_Role: "invalid role"
}

const URLS = {
    users: "http://localhost:8080/admin/realms/user-realm/users/",
    login: "http://localhost:8080/realms/user-realm/protocol/openid-connect/token",
    roles: "http://localhost:8080/admin/realms/user-realm/roles/",
    logout: "http://localhost:8080/realms/user-realm/protocol/openid-connect/logout"
    
}

module.exports = {
    adminLogin,
    roles,
    userLogin,
    errorMessages,
    URLS
}