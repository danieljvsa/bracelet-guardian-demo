const knex = require('../database')
const {paginate} = require('knex')

module.exports.checkEmailAndActive = async (req, res, next) => {
    if(typeof req.body.email !== "string") return res.send({success: false, error: "email is missing!"})
    
    try {
        const invite = await knex('invites').where({email: req.body.email, active: true})
        if(invite.length > 0) return res.send({success: false, error: "There is already an invite active."})
        next()
    } catch (error) {
        console.log("middlewares/invite/checkEmailAndActive: ", error)
        return res.send({success: false, error: error})
    }
}

module.exports.checkByEmailAndActive = async (req, res, next) => {
    if(typeof req.body.email !== "string") return res.send({success: false, error: "email is missing!"})
    
    try {
        const invite = await knex('invites').where({email: req.body.email, active: true})
        if(invite.length < 1) return res.send({success: false, error: "There is no invite active."})
        
        req.invite = invite[0]
        next()
    } catch (error) {
        console.log("middlewares/invite/checkEmailAndActive: ", error)
        return res.send({success: false, error: error})
    }
}

module.exports.checkByParams = async (req, res, next) => {
    if(typeof req.params.inviteId !== "string") return res.send({success: false, error: "email is missing!"})

    try {
        
        const invite = await knex('invites').where({id: req.params.inviteId})
        if(!invite.length) return res.send({success: false, error: "No invite registered."})
        
        req.invite = invite[0]
        next()

    } catch (error) {
        console.log("middlewares/invite/checkByParams: ", error)
        return res.send({success: false, error: error})
    }

}

module.exports.getInvitesList = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = 10; 
    const offset = (page - 1) * limit; 
    const sortBy = req.query.sortBy || 'id';  
    const sortOrder = req.query.sortOrder || 'asc'; 

    try {
        
        const invites = await knex('invites')
        .select('organizations.name as organization', 'invites.*') 
        .innerJoin('organizations', 'invites.orgId', 'organizations.orgId')
        .innerJoin('users', 'invites.createdBy', 'users.id')
        .where({"invites.orgId": req.user.orgId})
        .orderBy(sortBy, sortOrder)
        .limit(limit) 
        .offset(offset); 
        const totalCount = await knex('users').count('* as total');  
        const totalPages = Math.ceil(totalCount[0].total / limit); 
        
        req.invites = {
            data: invites, 
            currentPage: page, 
            totalPages, 
            totalCount: totalCount[0].total 
        }
        next()

    } catch (error) {
        console.log("middlewares/invite/getInvitesList: ", error)
        return res.send({success: false, error: error})
    }

}