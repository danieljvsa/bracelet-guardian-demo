const knex = require('../database');

module.exports.get = async (req, res) => {
    return res.send({success: true, data: req.nurse})
}

module.exports.getAll = async (req, res) => {
    return res.send({success: true, data: req.nurses})
}

module.exports.create = async (req, res) => {
    const {name, division, phone} = req.body
    try {
        
        await knex('nurses').insert({
            nurseName: name,
            phone: phone,
            division: division,
            orgId: req.user.orgId
        })

        const nurse = await knex('nurses').where({nurseName: name,
            phone: phone,
            division: division
        })
        if(!nurse.length) return res.send({success: false, error: "Nurse not created."})

        return res.send({success: true, data: nurse[0].nurseId})
    } catch (error) {
        console.log("controllers/nurses/create: ", error)
        return res.send({success: false, error: error})
    }
}

module.exports.update = async (req, res) => {
    const { name, division, phone } = req.body;

    try {
        const divisionAvailable = ["front", "end"]
        if(typeof division === "string" && !divisionAvailable.includes(division)) return res.send('Division option not valid.')
    
        await knex('nurses') 
        .update({ 
            nurseName: name ? name : req.nurse.nurseName, 
            phone: phone ? phone : req.nurse.phone,
            division: division ? division : req.nurse.division
        })
        .where({nurseId: req.nurse.nurseId}) 
        .catch((error) => {
            console.log("controllers/nurses/update", error)
            return res.send({success: false, error})
        })
        return res.send({success: true, data: req.nurse.nurseId})
    } catch (error) {
        console.log("controllers/nurses/update: ", error)
        return res.send({success: false, error: error})
    }
    
}

module.exports.delete = async (req, res) => {
    try { 
        await knex('nurses').where('nurseId', req.nurse.nurseId).del(); 
        
        return res.send({success: true, data: req.nurse.nurseId})
    } catch (error) { 
        console.log("controllers/nurses/update: ", error)
        return res.send({success: false, error: error})
    }
}