const knex = require('../database')
const logic = require('../logic')

module.exports.checkByParams = async (req, res, next) => {
    if(typeof req.params.braceletId !== "string") return res.send({success: false, error: "nurseId is missing!"})

    try {
        
        const bracelet = await knex('bracelets').where({braceletId: req.params.braceletId})
        if(!bracelet.length) return res.send({success: false, error: "No bracelet registered."})
        
        req.bracelet = bracelet[0]
        next()

    } catch (error) {
        console.log("middlewares/bracelets/checkByParams: ", error)
        return res.send({success: false, error: error})
    }

}

module.exports.getBraceletsList = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = 10; 
    const offset = (page - 1) * limit; 
    const sortBy = req.query.sortBy || 'braceletId';  
    const sortOrder = req.query.sortOrder || 'asc'; 

    try {

        const patients = await knex('patients').where({orgId: req.user.orgId})
        if(!patients.length) return res.send({success: true, data: { data: [], currentPage: 0, totalPages: 0, totalCount: "0" }})
        console.log(patients.map(r => r.patientId))
        const bracelets = await knex('bracelets')
        .select('patients.patientName as patientName', 'bracelets.*') 
        .innerJoin('patients', 'bracelets.patientId', 'patients.patientId')
        .whereIn("bracelets.patientId", patients.map(r => r.patientId))
        .orderBy(sortBy, sortOrder)
        .limit(limit) 
        .offset(offset); 
        const totalCount = await knex('bracelets').whereIn("bracelets.patientId", patients.map(r => r.patientId)).count('* as total');  
        const totalPages = Math.ceil(totalCount[0].total / limit); 
        
        req.bracelets = {
            data: bracelets, 
            currentPage: page, 
            totalPages, 
            totalCount: totalCount[0].total 
        }
        next()

    } catch (error) {
        console.log("middlewares/bracelets/getBraceletsList: ", error)
        return res.send({success: false, error: error})
    }

}

module.exports.checkDuplicate = async (req, res, next) => {
    const {macAddress} = req.body;
    if(typeof macAddress !== "string") return res.send({success: false, error: "Missing macAddress."})

    try {
        const verifyMacAddress = await logic.master.checkMacAddress(macAddress)
        if(!verifyMacAddress.success) return res.send(verifyMacAddress)
        if(!verifyMacAddress.data) return res.send({success: false, error: "Bad formatting macAddress."})

        const bracelet = await knex('bracelets').where({macAddress: macAddress})
        if (bracelet.length > 0) return res.send({success: false, error: 'Bracelet already exists.'})
        
    } catch (error){
        console.log("middlewares/bracelets/checkDuplicate: ", error)
        return res.send({success: false, error: error})
    }
    next()
}

module.exports.checkMacAddressAndPatient = async (req, res, next) => {
    const {macAddress} = req.body;
    if(typeof macAddress !== "string") return res.send({success: false, error: "Missing macAddress."})

    try {
        const verifyMacAddress = await logic.master.checkMacAddress(macAddress)
        if(!verifyMacAddress.success) return res.send(verifyMacAddress)
        if(!verifyMacAddress.data) return res.send({success: false, error: "Bad formatting macAddress."})

        const bracelet = await knex('bracelets').where({macAddress: macAddress})
        if (!bracelet.length) return res.send({success: false, error: 'Bracelet not found.'})
        
        const patient = await knex('patients').where({patientId: bracelet[0].patientId})
        if (!patient.length) return res.send({success: false, error: 'Patient not found.'})
        
        req.patient = patient[0]
        req.bracelet = bracelet[0]
    } catch (error){
        console.log("middlewares/bracelets/checkMacAddressAndPatient: ", error)
        return res.send({success: false, error: error})
    }

    next()
}

module.exports.getBraceletsByPatient = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = 10; 
    const offset = (page - 1) * limit; 
    const sortBy = req.query.sortBy || 'braceletId';  
    const sortOrder = req.query.sortOrder || 'asc'; 

    try {

        const bracelets = await knex('bracelets')
        .select('patients.patientName', 'bracelets.*') 
        .innerJoin('patients', 'bracelets.patientId', 'patients.patientId')
        .where({"bracelets.patientId": req.patient.patientId})
        .orderBy(sortBy, sortOrder)
        .limit(limit) 
        .offset(offset); 
        const totalCount = await knex('bracelets').where({"bracelets.patientId": req.patient.patientId}).count('* as total');  
        const totalPages = Math.ceil(totalCount[0].total / limit); 
        
        req.bracelets = {
            data: bracelets, 
            currentPage: page, 
            totalPages, 
            totalCount: totalCount[0].total 
        }
        next()

    } catch (error) {
        console.log("middlewares/bracelets/getBraceletsList: ", error)
        return res.send({success: false, error: error})
    }

}