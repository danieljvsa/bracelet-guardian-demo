const knex = require('../database')

module.exports.checkByParams = async (req, res, next) => {
    if(typeof req.params.nurseId !== "string") return res.send({success: false, error: "nurseId is missing!"})

    try {
        
        const nurse = await knex('nurses').where({id: req.params.nurseId})
        if(!nurse.length) return res.send({success: false, error: "No nurse registered."})
        
        req.nurse = nurse[0]
        next()

    } catch (error) {
        console.log("middlewares/nurses/checkByParams: ", error)
        return res.send({success: false, error: error})
    }

}

module.exports.getNursesList = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = 10; 
    const offset = (page - 1) * limit; 
    const sortBy = req.query.sortBy || 'nurseId';  
    const sortOrder = req.query.sortOrder || 'asc'; 

    try {
        
        const nurses = await knex('nurses')
        .select('organizations.name as organization', 'nurses.*') 
        .innerJoin('organizations', 'nurses.orgId', 'organizations.orgId')
        .where({"nurses.orgId": req.user.orgId})
        .orderBy(sortBy, sortOrder)
        .limit(limit) 
        .offset(offset); 
        const totalCount = await knex('nurses').where({"nurses.orgId": req.user.orgId}).count('* as total');  
        const totalPages = Math.ceil(totalCount[0].total / limit); 
        
        req.nurses = {
            data: nurses, 
            currentPage: page, 
            totalPages, 
            totalCount: totalCount[0].total 
        }
        next()

    } catch (error) {
        console.log("middlewares/nurses/getNursesList: ", error)
        return res.send({success: false, error: error})
    }

}

module.exports.checkDuplicate = async (req, res, next) => {
    const {name, phone} = req.body;
    if(typeof name !== "string" || typeof phone !== "string") return res.send({success: false, error: "Missing phone."})

    try {

        const nurse = await knex('nurses').where({nurseName: name}).orWhere({phone: phone})
        if (nurse.length > 0) return res.send({success: false, error: 'Nurse already exists.'})
        
    } catch (error){
        console.log("middlewares/nurses/checkDuplicate: ", error)
        return res.send({success: false, error: error})
    }
    next()
}

module.exports.checkDivision = async (req, res, next) => {
    const {division} = req.body
    if(typeof division !== "string") return res.send({success: false, error: "division is missing!"})
    
    const divisionAvailable = ["front", "end"]
    if(!divisionAvailable.includes(division)) return res.send('Division option not valid.')
    
    next()
}