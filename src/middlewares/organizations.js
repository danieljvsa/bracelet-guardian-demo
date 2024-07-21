const knex = require('../database')

module.exports.checkByParams = async (req, res, next) => {
    if(typeof req.params.orgId !== "string") return res.send({success: false, error: 'Missing orgId.'})
    
    try {
        const org = await knex('organizations').where({orgId: req.params.orgId})
        if (!org.length) return res.send({success: false, error: 'No Organization found.'})
        
        req.org = org[0];
    } catch (error){
        console.log("middlewares/organizations/checkByParams: ", error)
        return res.send({success: false, error: error})
    }
    
    next()
}

module.exports.checkDuplicate = async (req, res, next) => {
    const {code} = req.body;
    if(typeof code !== "string") return res.send({success: false, error: "Missing code."})

    try {
        console.log(code)
        const org = await knex('organizations').where({code: code})
        if (org.length > 0) return res.send({success: false, error: 'Organization already exists.'})
        
    } catch (error){
        console.log("middlewares/organizations/checkDuplicate: ", error)
        return res.send({success: false, error: error})
    }
    next()
}

module.exports.getOrganizationsList = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = 10; 
    const offset = (page - 1) * limit; 
    const sortBy = req.query.sortBy || 'orgId';  
    const sortOrder = req.query.sortOrder || 'asc'; 

    try {
    
        const orgs = await knex('organizations')
        .orderBy(sortBy, sortOrder)
        .limit(limit) 
        .offset(offset); 
        const totalCount = await knex('organizations').count('* as total');  
        const totalPages = Math.ceil(totalCount[0].total / limit); 
        
        req.orgs = {
            data: orgs, 
            currentPage: page, 
            totalPages, 
            totalCount: totalCount[0].total 
        }
        next()

    } catch (error) {
        console.log("middlewares/organizations/getOrganizationsList: ", error)
        return res.send({success: false, error: error})
    }

}

module.exports.checkAdminOrganization = async (req, res, next) => {
    
    try {

        const org = await knex('organizations').where({orgId: req.user.orgId})
        if (!org.length) return res.send({success: false, error: 'No Organization found.'})
        if (org[0].code !== "admin") return res.send({success: true, data: {
            data: org[0], 
            currentPage: 1, 
            totalPages: 1, 
            totalCount: "1" 
        }})

    } catch (error){
        console.log("middlewares/organizations/checkAdminOrganization: ", error)
        return res.send({success: false, error: error})
    }
    
    next()
}