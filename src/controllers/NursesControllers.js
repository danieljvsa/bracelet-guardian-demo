const knex = require('../database')


module.exports = {
    
    async get(req, res){
        knex('nurses').then((data) => {
            res.send(data)
        })
    },
    async create(req,res, next){
        try {
            const {username} = req.body
            
            await knex('nurses').insert({
                nurseName: username
            })

            return res.status(201).send('Nurse ' + username + ' added.')
        } catch (error) {
            next(error)
        }
    },

    async update(req, res, next){
        try {
            const {username} = req.body
            const {id} = req.params

            await knex('nurses').update({
                nurseName: username
            }).where({
                nurseId: id
            })

            return res.status(200).send('Nurse name updated')
        } catch (error) {
            next(error)
        }
    },

    async delete(req, res, next){
        try {
            const {id} = req.params

            await knex('nurses').where({
                nurseId: id
            }).del()

            return res.send('Nurse deleted')

        } catch (error) {
            next(error)
        }
    }
}

