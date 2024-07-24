const knex = require('../database')

module.exports.checkByParams = async (req, res, next) => {
    if(typeof req.params.alertId !== "string") return res.send({success: false, error: "nurseId is missing!"})

    try {
        
        const alert = await knex('alerts').where({alertId: req.params.alertId})
        if(!alert.length) return res.send({success: false, error: "No alert registered."})
        
        req.alert = alert[0]
        next()

    } catch (error) {
        console.log("middlewares/alerts/checkByParams: ", error)
        return res.send({success: false, error: error})
    }

}

module.exports.getAlertsListByBracelet = async (req, res, next) => {
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
        const totalCount = await knex('alerts').where({"alerts.patientId": req.patient.patientId}).count('* as total');  
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

module.exports.getAlertsList = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = 10; 
    const offset = (page - 1) * limit; 
    const sortBy = req.query.sortBy || 'alertId';  
    const sortOrder = req.query.sortOrder || 'asc'; 

    try {

        const patients = await knex('patients').where({orgId: req.user.orgId})
        if(!patients.length) return res.send({success: true, data: { data: [], currentPage: 0, totalPages: 0, totalCount: "0" }})

        const alerts = await knex('alerts')
        .select('bracelets.imei as imei', 'bracelets.macAddress', 'alerts.*') 
        .innerJoin('bracelets', 'alerts.braceletId', 'bracelets.braceletId')
        .whereIn("alerts.patientId", patients.map(r => r.patientId))
        .orderBy(sortBy, sortOrder)
        .limit(limit) 
        .offset(offset); 
        const totalCount = await knex('alerts').whereIn("alerts.patientId", patients.map(r => r.patientId)).count('* as total');  
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