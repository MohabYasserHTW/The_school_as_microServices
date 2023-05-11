const axios = require("axios")

const getDataFromOtherService = async (token) => {
    
    
        const data =axios({
            method: "POST",
            url: "http://localhost:5002/api",
            data: {
                token
            }
        }).then(data=>data.data).catch(err =>err.response.data)
        
        
    return data
    
    
}

exports.getDataFromOtherService = getDataFromOtherService