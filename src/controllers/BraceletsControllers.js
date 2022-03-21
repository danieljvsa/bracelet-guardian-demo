const knex = require('../database')


module.exports = {
     
    async get(req, res){
        knex('bracelets').then((data) => {
            res.send(data)
        })
    },
    async create(req, res, next){
        try {
            const {macAddress, username} = req.body
            let id = 0
            await knex('profiles').where({
                profileName: username,
            }).then((data) => {
                console.log(id)
                id = data[0].profileId
                console.log(data)
            })

            if(id != 0 && id != null){
                await knex('bracelets').insert({
                    macAddress: macAddress,
                    profileId: id
                })

                return res.status(201).send('Bracelet is ' + macAddress + '  connected.')
            } else {
                return res.status(500).send('Bracelet  ' + macAddress + ' was not connected.')
            }

            
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