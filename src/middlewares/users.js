const knex = require('../database')
const logic = require('../logic')

module.exports.checkByEmail = async (req, res, next) => {
    const {email} = req.body
    if(typeof email !== "string") return res.send({success: false, error: 'Missing email.'})
    
    try {
        const user = await knex('users').where({email: email})
        if (!user.length) {
            return res.send({success: false, error: 'No User found with this email.'})
        }
        req.user = user[0]
    } catch (error){
        console.log("middlewares/users/checkByEmail: ", error)
        return res.send({success: false, error: error})
    }

    next()
}

module.exports.checkTokenHasExpiried = async (req, res, next) => {
    const {token} = req.body
    if(typeof token !== "string") return res.send({success: false, error: "Missing or bad formatting token."})
   
    const compareToken = await logic.master.comparePassword(token, req.user.passwordResetToken)
    if(!compareToken.success) return res.send(compareToken)

    const now = new Date()

    if (now > req.user.passwordResetExpires) {
        return res.send({success: false, error: 'Token expired.'})
    }

    next()
}

module.exports.checkDuplicate = async (req, res, next) => {
   
    try {
        const user = await knex('users').where({email: req.invite.email})
        if (user.length > 0) {
            return res.send({success: false, error: 'User already created.'})
        }
        
    } catch (error){
        console.log("middlewares/users/checkDuplicate: ", error)
        return res.send({success: false, error: error})
    }

    next()
}

module.exports.getUsersList = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = 10; 
    const offset = (page - 1) * limit; 
    const sortBy = req.query.sortBy || 'id';  
    const sortOrder = req.query.sortOrder || 'asc'; 

    try {
        console.log(req.user.orgId)
        const invites = await knex('users')
        .select('users.*', 'organizations.name as organization') 
        .innerJoin('organizations', 'users.orgId', 'organizations.orgId')
        .where({"users.orgId": req.user.orgId})
        .orderBy(sortBy, sortOrder)
        .limit(limit) 
        .offset(offset); 
        const totalCount = await knex('users').count('* as total');  
        const totalPages = Math.ceil(totalCount[0].total / limit); 
        
        req.users = {
            data: invites, 
            currentPage: page, 
            totalPages, 
            totalCount: totalCount[0].total 
        }
        
    } catch (error) {
        console.log("middlewares/users/getUsersList: ", error)
        return res.send({success: false, error: error})
    }
    
    next()
}