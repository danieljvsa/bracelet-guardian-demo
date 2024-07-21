const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

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

module.exports.generateUUID = async () => {
    try{
        const uuid = await crypto.randomUUID()
        return {success: true, data: uuid}
    } catch (error) {
        console.log("logic/master/generateUUID: ", error)
        return {success: true, error}
    }
}

module.exports.checkMacAddress = async (macAddress) => {
    let MACRegex = new RegExp("^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$");

    try {
        const result = MACRegex.test(macAddress)
        return {success: true, data: result}
    } catch (error) {
        console.log("logic/master/checkMacAddress: ", error)
        return {success: true, error}
    }
}