const jwt = require('jsonwebtoken')
const knex = require('../database')
const logic = require('../logic')


module.exports.validateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.send({success: false, error: 'No token provided'})
    }

    const parts = authHeader.split(' ')

    if(!parts.length === 2 ){
        return res.send({success: false, error: 'token error'})
    }
    
    const [scheme, token] = parts

    if(!/^Bearer$/i.test(scheme)){
        return res.send({success: false, error: 'token malformatted'})
    }

    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
        if(err) return res.send({success: false, error: 'token invalid'})
    
        req.userId = decoded.id
        const user = await knex('users').where({
            id: decoded.id
        })

        if (user.length === 0) return res.send({success: false, error: 'That user is not registered'})
        
        if(!user[0].active) return res.send({success: false, error: "User's account not active."})

        const org = await knex('organizations').where({id: user[0].orgId})
        if (!org.length) return res.send({success: false, error: 'No Organization found.'})

        const compareApiKey = await logic.master.comparePassword(req.headers.apiKey, org[0].apiKey)
        if(!compareApiKey.success) return res.send(compareApiKey)
        if(!compareApiKey.data) return res.send({success: false, error: "Unauthorized"})

        req.user = user[0]
        return next()
    })

}

module.exports.validateAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.send({success: false, error: 'No token provided'})
    }

    const parts = authHeader.split(' ')

    if(!parts.length === 2 ){
        return res.send({success: false, error: 'token error'})
    }
    
    const [scheme, token] = parts

    if(!/^Bearer$/i.test(scheme)){
        return res.send({success: false, error: 'token malformatted'})
    }

    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
        if(err) return res.send({success: false, error: 'token invalid'})
    
        req.userId = decoded.id
        const user = await knex('users').where({
            id: decoded.id
        })

        if (user.length === 0) {
          return res.send({success: false, error: 'That user is not registered'})
        }

        if(!user[0].active) return res.send({success: false, error: "User's account not active."})
        
        const org = await knex('organizations').where({
            orgId: user[0].orgId
        })

        if(org.code !== "admin") return res.send({success: false, error: "Unauthorized"})
        req.manager = user[0]
    
        return next()
    })

}