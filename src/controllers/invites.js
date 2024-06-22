const logic = require('../logic')

module.exports.get = async (req, res) => {
    return res.send({success: true, data: req.invite})
}

module.exports.getAll = async (req, res) => {
    return res.send({success: true, data: req.invites})
}

module.exports.delete = async (req, res) => {

    try {
        const deactivate = await knex("invites").update({
            active: false
        }).where({
            id: req.invite.id
        })
        if(deactivate > 0) return res.send({success: true, data: req.invite.id})
        else return res.send({error: "Invite not found."})
    } catch (error) {
        console.log("controllers/invite/delete: ", error)
        return res.send({success: false, error: error})
    }

} 

module.exports.update = async (req, res) => {
    const { name, email, organization } = req.body;

    try {
        const org = await knex('organizations').where({id: req.user.orgId})
        if(!org.length) return res.send({success: false, error: "Organization not found."})

        const orgId = (org[0].code !== "admin") ? req.invite.orgId : organization;

        const update = knex('invites') 
        .where({id: req.invite.id}) 
        .update({ 
            name: name ? name : knex.raw('invites.name'), 
            email: email ? email : knex.raw('invites.email'), 
            orgId: orgId ? orgId : knex.raw('invites.orgId')
        });
        if(!update.length) return res.send({success: false, error: "Invite not found."}) 
    } catch (error) {
        console.log("controllers/invite/update: ", error)
        return res.send({success: false, error: error})
    }

}

module.exports.create = async (req, res) => {
    const { name, email, organization } = req.body;
    if(typeof name !== "string" || typeof email !== "string") return res.send({success: false, error: "name or email missing."})
    
    try {
        let orgId = req.user.orgId;

        const org = await knex('organizations').where({id: req.user.orgId})
        if(!org.length) return res.send({success: false, error: "Organization not found."})

        if(typeof organization !== "string") orgId = (org[0].code !== "admin") ? req.invite.orgId : organization;

        const [id] = await knex('invites').insert({
            name: name,
            email: email,
            orgId: orgId,
            active: true,
            isAdmin: (org[0].code !== "admin") ? true : false,
            createdBy: req.user.id
        });

        const token = await logic.master.generateRandomNumber();
        if(!token.success) return res.send(token)
        
        const now = new Date()
        now.setHours(now.getHours() + 1)

        await knex('invites').update({
            codeResetToken: token.data,
            codeResetExpires: now
        }).where({id: id})

        mailer.sendMail({
            to: email,
            from: process.env.NODE_USER,
            template: 'auth/invite',
            subject: 'Invite to platform',
            context: {token}
        }, (err) => {
            if (err) {
                console.log("controllers/invites/create/sendMail: ", err)
                return res.send({success: false, error: 'Cannot send token'})
            }
        })

        if(id) return res.send({success: true, data: id})
        else return res.send({error: "User not created."})
    } catch (error) {
        console.log("controllers/invite/create: ", error)
        return res.send({success: false, error: error})
    }

}

module.exports.resend = async (req, res) => {
    try {
        const token = await logic.master.generateRandomNumber();
        if(!token.success) return res.send(token)
        
        const now = new Date()
        now.setHours(now.getHours() + 1)

        await knex('invites').update({
            codeResetToken: token.data,
            codeResetExpires: now
        }).where({id: req.invite.id})

        mailer.sendMail({
            to: email,
            from: process.env.NODE_USER,
            template: 'auth/invite',
            subject: 'Invite to platform',
            context: {token}
        }, (err) => {
            if (err) {
                console.log("controllers/invites/resend/sendMail: ", err)
                return res.send({success: false, error: 'Cannot send token'})
            }
        })
        return res.send({success: true, data: req.invite.id})
    } catch (error) {
        console.log("controllers/invites/resend: ", error)
        return res.send({success: false, error: error})
    }
} 