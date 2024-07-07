const knex = require('../database');

module.exports.get = async (req, res) => {
    return res.send({success: true, data: req.patient})
}

module.exports.getAll = async (req, res) => {
    return res.send({success: true, data: req.patients})
}

module.exports.create = async (req, res) => {
    const {name, age} = req.body
    if(typeof age !== "number") return res.send({success: false, error: "Missing age."})
    if(age < 0 || age > 120) return res.send({success: false, error: "Bad formatting age."})
    
    try {
        
        await knex('patients').insert({
            patientName: name,
            age: age,
        })

        const patient = await knex('patients').where({
            patientName: name,
            age: age,
        })
        if(!patient.length) return res.send({success: false, error: "Patient not created."})

        return res.send({success: true, data: patient[0].patientId})
    } catch (error) {
        console.log("controllers/patients/create: ", error)
        return res.send({success: false, error: error})
    }
}

module.exports.update = async (req, res) => {
    const { name, age } = req.body;
    if(typeof age === "number" && (age < 0 || age > 120)) return res.send({success: false, error: "Bad formatting age."})

    try {
    
        await knex('patients') 
        .update({ 
            patientName: name ? name : req.patient.patientName, 
            age: age ? age : req.patient.phone,
        })
        .where({patientId: req.patient.patientId}) 
        .catch((error) => {
            console.log("controllers/patients/update", error)
            return res.send({success: false, error})
        })
        return res.send({success: true, data: req.patient.patientId})
    } catch (error) {
        console.log("controllers/patients/update: ", error)
        return res.send({success: false, error: error})
    }
    
}

module.exports.delete = async (req, res) => {
    try { 
        await knex('patients').where('patientId', 1).del(); 
        
        return res.send({success: true, data: req.patient.patientId})
    } catch (error) { 
        console.log("controllers/patients/update: ", error)
        return res.send({success: false, error: error})
    }
}