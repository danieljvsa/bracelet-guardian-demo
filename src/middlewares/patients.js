const knex = require('../database')

module.exports.checkByParams = async (req, res, next) => {
    if(typeof req.params.patientId !== "string") return res.send({success: false, error: "patientId is missing!"})

    try {
        
        const patient = await knex('patients').where({patientId: req.params.patientId})
        if(!patient.length) return res.send({success: false, error: "No patient registered."})
        
        req.patient = patient[0]
        next()

    } catch (error) {
        console.log("middlewares/patients/checkByParams: ", error)
        return res.send({success: false, error: error})
    }

}

module.exports.getPatientsList = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = 10; 
    const offset = (page - 1) * limit; 
    const sortBy = req.query.sortBy || 'patientId';  
    const sortOrder = req.query.sortOrder || 'asc'; 

    try {
        
        const patients = await knex('patients')
        .select('organizations.name as organization', 'patients.*') 
        .innerJoin('organizations', 'patients.orgId', 'organizations.orgId')
        .where({"patients.orgId": req.user.orgId})
        .orderBy(sortBy, sortOrder)
        .limit(limit) 
        .offset(offset); 
        const totalCount = await knex('patients').where({"patients.orgId": req.user.orgId}).count('* as total');  
        const totalPages = Math.ceil(totalCount[0].total / limit); 
        
        req.patients = {
            data: patients, 
            currentPage: page, 
            totalPages, 
            totalCount: totalCount[0].total 
        }
        next()

    } catch (error) {
        console.log("middlewares/patients/getPatientsList: ", error)
        return res.send({success: false, error: error})
    }

}

module.exports.checkDuplicate = async (req, res, next) => {
    const {name} = req.body;
    if(typeof name !== "string") return res.send({success: false, error: "Missing name."})

    try {

        const patient = await knex('patients').where({patientName: name})
        if (patient.length > 0) return res.send({success: false, error: 'Patient already exists.'})
        
    } catch (error){
        console.log("middlewares/patients/checkDuplicate: ", error)
        return res.send({success: false, error: error})
    }
    next()
}
