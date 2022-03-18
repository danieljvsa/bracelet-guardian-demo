const knex = require('../database')


module.exports = {
    async index(req, res) {
        await res.send('Welcome to Brace Guardin API demo. For more information go <a href="">here</a>.')
    }, 
    async get(req, res){
        knex('profiles').then((data) => {
            res.send(data)
        })
    },
    async create(req,res, next){
        try {
            const {username} = req.body
            
            await knex('profiles').insert({
                profileName: username
            })

            return res.status(201).send('Patient ' + username + ' added.')
        } catch (error) {
            next(error)
        }
    },

    async update(req, res, next){
        try {
            const {username} = req.body
            const {id} = req.params

            await knex('profiles').update({
                profileName: username
            }).where({
                profileId: id
            })

            return res.status(200).send('Patient name updated')
        } catch (error) {
            next(error)
        }
    },

    async delete(req, res, next){
        try {
            const {id} = req.params

            await knex('profiles').where({
                profileId: id
            }).del()

            return res.send('Patient deleted')

        } catch (error) {
            next(error)
        }
    }
}

