const getUsers = "SELECT * FROM users"
const getUserById = "SELECT * FROM users WHERE id = $1"
const checkNameExist = "SELECT u FROM users u WHERE u.name = $1"
const addUser = "INSERT INTO users (name,password,usertype) VALUES ($1,$2,$3)"
const deleteUser = "DELETE FROM users WHERE id = $1"
const updateUser = "UPDATE users SET password = $1 WHERE id = $2"

module.exports = {
    getUsers,
    getUserById,
    checkNameExist,
    addUser,
    deleteUser,
    updateUser
}