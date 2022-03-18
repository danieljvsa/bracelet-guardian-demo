const knex = require('../database')


module.exports = {
     
    async get(req, res){
        knex('bracelets').then((data) => {
            res.send(data)
        })
    },
    async create(req, res, next){
        try {
            const {macAddrress, id} = req.body
            
            await knex('bracelets').insert({
                macAddrress: macAddrress,
                profileId: id
            })

            return res.status(201).send('Bracelet  ' + macAddrress + '  connected.')
        } catch (error) {
            next(error)
        }
    },

    async delete(req, res, next){
        try {
            const {id} = req.params

            await knex('bracelets').where({
                braceletId: id
            }).del()

            return res.send('Bracelet deleted')

        } catch (error) {
            next(error)
        }
    }
    
}