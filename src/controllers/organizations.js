const knex = require('../database');
const logic = require('../logic')

module.exports.get = async (req, res) => {
    return res.send({success: true, data: req.org})
}

module.exports.getAll = async (req, res) => {
    return res.send({success: true, data: req.orgs})
}

module.exports.create = async (req, res) => {
    const { name, code} = req.body;
    if(typeof name !== "string" || typeof code !== "string") return res.send({success: false, error: "name or code missing."})
    
    try {
        await knex('organizations').insert({
            name: name,
            email: email,
            orgId: orgId,
            active: true,
            isAdmin: (org[0].code === "admin") ? true : false,
            createdBy: req.user.id
        })

        const org = await knex('organizations').where({name: name, code: code})
        if(!org.length) return res.send({success: false, error: "Organization not created."})
        
        return res.send({success: true, data: org[0].id})
    } catch (error) {
        console.log("controllers/organizations/create: ", error)
        return res.send({success: false, error: error})
    }
} 

module.exports.update = async (req, res) => {
    const { name, code } = req.body;

    try {

        await knex('organizations') 
        .update({ 
            name: name ? name : req.org.name, 
            code: code ? code : req.org.code
        })
        .where({id: req.org.id}) 
        .catch((error) => {
            console.log("controllers/organizations/update", error)
            return res.send({success: false, error})
        })
        return res.send({success: true, data: req.org.id})
    } catch (error) {
        console.log("controllers/organizations/update: ", error)
        return res.send({success: false, error: error})
    }
    
}

module.exports.generateApiKey = async (req, res) => {
    try {
        const key = await logic.master.generateUUID()
        if(!key.success) return res.send(key)

        const hashKey = await logic.master.hashNumber(key.data)
        if(!hashKey.success) return res.send(hashKey)

        mailer.sendMail({
            to: req.user.email,
            from: process.env.NODE_USER,
            template: 'organizations/apiKey',
            subject: 'New API Key',
            context: {token: key.data}
        }, (err) => {
            if (err) {
                console.log("controllers/users/generateApiKey/sendEmail: ", err)
                return res.send({success: false, error: 'Cannot send apiKey'})
            }
        })

        await knex('organizations').update({apiKey: hashKey.data}).where({orgId: req.org.orgId})
        .catch((error) => {
            console.log("controllers/organizations/generateApiKey", error)
            return res.send({success: false, error})
        })
        
        return res.send({success: true, data: req.org.id})
    } catch (error) {
        console.log("controllers/organizations/generateApiKey: ", error)
        return res.send({success: false, error: error})
    }
}