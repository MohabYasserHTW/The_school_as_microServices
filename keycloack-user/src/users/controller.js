const pool = require("../../db")
const queries = require("./queries")



const getUsers = (req,res,next)=>{
    pool.query(queries.getUsers,(err,result)=>{
        if(err) throw err
        
        res.status(200).json(result.rows)
    })
}

const getUserbyId = (req,res,next)=>{
    const id = parseInt(req.params.id);

    pool.query(queries.getUserById,[id],(err,result)=>{
        if(err) throw err
        res.status(200).json(result.rows)
    })
}

const addUser = (req,res,next) => {
    const {name, password, userType} = req.body

    //check if already exist

    pool.query(queries.checkNameExist,[name],(err,result)=>{
        if(err) {
            throw err
        }
        if(result.rows.length){ 
            res.send("Already exist .")
            return next()
        }
        pool.query(queries.addUser,[name,password,userType],(err,result) => {
            if(err) throw err
            res.status(201).send("Created successfully ")
        })
    })

    

}

const deleteUser = (req,res,next) =>{
    const id = parseInt(req.params.id);

    pool.query(queries.getUserById,[id],(err,result)=>{
        if(err) throw err
        if(!result.rows.length){
             res.send("user doesnt exist") 
             return next()
            }
        pool.query(queries.deleteUser,[id],(err,result) => {
            if(err) throw err
            res.status(200).send("removed successfully")
        })
    })
}

const editUser = (req,res,next) => {
    const id = parseInt(req.params.id);
    const {password} = req.body

    pool.query(queries.getUserById,[id],(err,result)=>{
        if(err) throw err
        if(!result.rows.length){
             res.send("user doesnt exist") 
             return next()
        }
        pool.query(queries.updateUser,[password,id],(err,result) => {
            if(err) throw err
            res.status(200).send("updated successfully")
        })
    })
}

module.exports = {
    getUsers,
    getUserbyId,
    addUser,
    deleteUser,
    editUser
}