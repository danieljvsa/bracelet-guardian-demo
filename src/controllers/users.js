const knex = require('../database');
const logic = require('../logic')
const bcrypt = require('bcryptjs')
const mailer = require('../modules/mailer')

module.exports.getAll = async (req, res) => {
    return res.send({success: true, data: req.users})
}

module.exports.get = async (req, res) => {
    return res.send({success: true, data: req.user})
}

module.exports.delete = async (req, res) => {
    try {
        if(!req.manager.isAdmin) return res.send({success: false, error: "Unauthorized action."})
        const deactivate = await knex("users").update({
            active: false
        }).where({
            id: req.user.id
        })
        if(deactivate > 0) return res.send({success: true, data: req.user.id})
        else return res.send({error: "Couldn't deactivate user."})
    } catch (error) {
        
    }
}

module.exports.forgotPassword = async (req, res) => {

    try {
        const token = await logic.master.generateRandomNumber();
        if(!token.success) return res.send(token)
        
        const now = new Date()
        now.setHours(now.getHours() + 1) 

        const hashedToken = await logic.master.hashNumber(token.data)
        if(!hashedToken.success) return res.send(hashedToken)

        await knex('users').update({
            passwordResetToken: hashedToken.data,
            passwordResetExpires: now
        }).where({id: req.user.id})

        mailer.sendMail({
            to: req.user.email,
            from: process.env.NODE_USER,
            template: 'auth/forgot_password',
            subject: 'Password reset',
            context: {token: token.data}
        }, (err) => {
            if (err) {
                console.log("controllers/users/forgotPassword/sendEmail: ", err)
                return res.send({success: false, error: 'Cannot send token'})
            }
        })
        
        return res.send({success: true, data: req.user.id})
    } catch (error) {
        console.log("controllers/users/forgotPassword: ", error)
        return res.send({success: false, error: error})
    }
}

module.exports.resetPassword = async (req, res) => {
    const {password} = req.body
    if(typeof password !== "string") return res.send({success: false, error: 'Missing or bad formatting password'})

    try {

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) return res.send({success: false, error: err});
                const hashedPassword = hash;
                console.log(hashedPassword)
                await knex('users').where({id: req.user.id}).update({password: hashedPassword})
            })
        })

        return res.send({success: true, data: req.user.id})
    } catch (error) {
        console.log("controllers/users/resetPassword: ", error)
        return res.send({success: false, error})
    }
}

module.exports.authenticate = async (req, res) => {
    const {password} = req.body
    if(typeof password !== "string") return res.send({success: false, error: 'Missing or bad formatting password'})
    console.log(typeof password, password)
    const comparePassword = await logic.master.comparePassword(password, req.user.password)
    if(!comparePassword.success) return res.send(comparePassword)
    
    const token = await logic.master.generateToken({ id: req.user.id })
    if(!token.success) res.send(token)
    
    const user = {
        email: req.user.email,
        name: req.user.name, 
        token: token.data
    }

    return res.send({success: true, data: user})      
}

module.exports.create = async (req, res, next) =>{
    const {password} = req.body
    if(typeof password !== "string") return res.send({success: false, error: 'Missing or bad formatting password'})

    try {
        const newUser = {
            email: req.invite.email,
            name: req.invite.name,
            isAdmin: req.invite.isAdmin,
            orgId: req.invite.orgId,
            active: true
        }

        await bcrypt.genSalt(10, async (err, salt) => {
            await bcrypt.hash(password, salt, async (err, hash) => {
                if (err) return res.send({success: false, error: err});
                //console.log(hash)
                const hashedPassword = hash;
                console.log(hashedPassword)
                newUser.password = hashedPassword
                await knex('users').insert({...newUser, password: hashedPassword})
                
                await knex('invites').where({id: req.invite.id}).update({active: false})
                
                console.log(newUser.password)
                const user = await knex('users').where({email: req.invite.email, name: req.invite.name, active: true})
                if(!user.length) return res.send({success: false, error: "User not created."})
                
                const token = await logic.master.generateToken({ id: user[0].id })
                if(!token.success) res.send(token)
        
                const login = {
                    email: user[0].email,
                    name: user[0].name, 
                    token: token.data
                }
        
                return res.send({success: true, data: login})
            })
        })

    } catch (error) {
        console.log("controllers/users/resetPassword: ", error)
        return res.send({success: false, error})
    }
}