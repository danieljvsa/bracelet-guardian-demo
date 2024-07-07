const knex = require('../database');

module.exports.get = async (req, res) => {
    return res.send({success: true, data: req.bracelt})
}

module.exports.getAll = async (req, res) => {
    return res.send({success: true, data: req.bracelts})
}

module.exports.create = async (req, res) => {
    const {macAddress, imei, port} = req.body;
    if(typeof port !== "undefined" && port < 0) return res.send({success: false, error: "Port not found."})
    
    try {
        await knex('bracelets').insert({
            macAddress: macAddress,
            imei: imei ? imei : "",
            patientId: req.patient.patientId,
            battery: "0",
            port: port ? port : 0
        })

        const bracelet = await knex('bracelets').where({macAddress: macAddress})
        if(!bracelet.length) return res.send({success: false, error: "Bracelet not created."})
        
        return res.send({success: true, data: bracelet[0].braceletId})
    } catch (error) {
        console.log("controllers/bracelets/create: ", error)
        return res.send({success: false, error: error})
    }
}

module.exports.update = async (req, res) => {
    const {macAddress, imei, patientId, battery, port} = req.body;

    try {
        let patient = []
        if(typeof patientId !== "undefined"){

            patient = await knex('patients').where({patientId: patientId, orgId: req.user.orgId})
            if(!patient.length) return res.send({success: false, error: "Patient not found."})
        }

        if(typeof port !== "undefined" && port < 0) return res.send({success: false, error: "Port not found."})

        await knex('bracelets').update({
            macAddress: macAddress ? macAddress : req.bracelet.macAddress,
            imei: imei ? imei : req.bracelet.imei,
            patientId: (patient.length) ? patient[0].patientId : req.bracelet.patientId,
            battery: battery ? battery : req.bracelet.battery,
            port: port ? port : req.bracelet.port
        }).where({patientId: req.bracelet.patientId})

        const bracelet = await knex('bracelets').where({macAddress: macAddress})
        if(!bracelet.length) return res.send({success: false, error: "Bracelet not created."})
        
        return res.send({success: true, data: bracelet[0].braceletId})
    } catch (error) {
        console.log("controllers/bracelets/create: ", error)
        return res.send({success: false, error: error})
    }
}

