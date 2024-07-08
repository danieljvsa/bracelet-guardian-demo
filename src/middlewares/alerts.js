const knex = require('../database')

module.exports.checkByParams = async (req, res, next) => {
    if(typeof req.params.braceletId !== "string") return res.send({success: false, error: "nurseId is missing!"})

    try {
        
        const bracelet = await knex('bracelets').where({id: req.params.braceletId})
        if(!bracelet.length) return res.send({success: false, error: "No bracelet registered."})
        
        req.bracelet = bracelet[0]
        next()

    } catch (error) {
        console.log("middlewares/bracelets/checkByParams: ", error)
        return res.send({success: false, error: error})
    }

}

module.exports.getAlertsList = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = 10; 
    const offset = (page - 1) * limit; 
    const sortBy = req.query.sortBy || 'alertId';  
    const sortOrder = req.query.sortOrder || 'asc'; 

    try {
        
        const alerts = await knex('alerts')
        .select('patients.patientId', 'patients.patientName', 'bracelets.imei as imei', 'bracelets.macAddress as macAddress', 'alerts.*') 
        .innerJoin('bracelets', 'alerts.braceletId', 'bracelets.braceletId')
        .innerJoin('patients', 'alerts.patientId', 'patients.patientId')
        .where({"alerts.braceletId": req.bracelet.braceletId})
        .orderBy(sortBy, sortOrder)
        .limit(limit) 
        .offset(offset); 
        const totalCount = await knex('alerts').where({"alerts.braceletId": req.bracelet.braceletId}).count('* as total');  
        const totalPages = Math.ceil(totalCount[0].total / limit); 
        
        req.alerts = {
            data: alerts, 
            currentPage: page, 
            totalPages, 
            totalCount: totalCount[0].total 
        }
        next()

    } catch (error) {
        console.log("middlewares/alerts/getAlertsList: ", error)
        return res.send({success: false, error: error})
    }

}

module.exports.getAlertsByPatient = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = 10; 
    const offset = (page - 1) * limit; 
    const sortBy = req.query.sortBy || 'alertId';  
    const sortOrder = req.query.sortOrder || 'asc'; 

    try {

        const alerts = await knex('alerts')
        .select('bracelets.imei as imei', 'bracelets.macAddress', 'alerts.*') 
        .innerJoin('bracelets', 'alerts.braceletId', 'bracelets.braceletId')
        .where({"alerts.patientId": req.patient.patientId})
        .orderBy(sortBy, sortOrder)
        .limit(limit) 
        .offset(offset); 
        const totalCount = await knex('alerts').whereIn({"alerts.braceletId": bracelets.map(r => r.braceletId)}).count('* as total');  
        const totalPages = Math.ceil(totalCount[0].total / limit); 
        
        req.alerts = {
            data: alerts, 
            currentPage: page, 
            totalPages, 
            totalCount: totalCount[0].total 
        }
        next()

    } catch (error) {
        console.log("middlewares/alerts/getAlertsByPatient: ", error)
        return res.send({success: false, error: error})
    }

}