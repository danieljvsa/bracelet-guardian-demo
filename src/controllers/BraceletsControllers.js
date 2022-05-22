const knex = require('../database')


module.exports = {
     
    async get(req, res){
        let braces = []
        let id = []
        let names = []
        let response = []

        await knex('bracelets').then((data) => {
            //console.log(data)
            for (let index = 0; index < data.length; index++) {
                braces.push(data[index].macAddress)
                id.push(data[index].profileId)
                
            }
        })
        
        for (let index = 0; index < id.length; index++) {
            //console.log(id[index])
            await knex('profiles').where({profileId: id[index]}).then((data) => {
                names.push(data[index].profileName)
            })
            
        }

        for (let index = 0; index < names.length; index++) {
            response.push({name: names[index], macAddress: braces[index]})
        }
        
        res.status(200).send(response)
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