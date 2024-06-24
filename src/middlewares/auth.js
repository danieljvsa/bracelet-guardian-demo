const jwt = require('jsonwebtoken')
const knex = require('../database')


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

        if (user.length === 0) {
          return res.send({success: false, error: 'That user is not registered'})
        }

        req.user = user[0]
        return next()
    })

}