const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports.generateRandomNumber = async () => { 
    try {   
        return {success: true, data: Math.floor(Math.random() * 900000) + 100000}; 
    } catch (error) {
        console.log("logic/master/generateRandomNumber: ", error)
        return {success: false, error: error}
    }
} 

module.exports.hashNumber = async (number) => { 
    try {
        const saltRounds = 10; 
        const salt = bcrypt.genSaltSync(saltRounds); 
        const hash = bcrypt.hashSync(number.toString(), salt);  
        return {success: true, data: hash};
    } catch (error) {
        console.log("logic/master/hashNumber: ", error)
        return {success: false, error: error}
    }
} 

module.exports.comparePassword = async (userInput, hashedPassword) => { 
    try {
        const isMatch = bcrypt.compareSync(userInput, hashedPassword); 
        return {success: true, data: isMatch}; 
    } catch (error) {
        console.log("logic/master/comparePassword: ", error)
        return {success: false, error: error}
    }
} 

module.exports.generateToken = async (params = {}) => {
    try{
        const token = await jwt.sign(params, process.env.JWT_KEY, {
            expiresIn: 86400 // 24 hours
        })
        return {success: true, data: token}
    } catch (error) {
        console.log("logic/master/generateToken: ", error)
        return {success: true, error}
    }
}