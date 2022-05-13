const knex = require('../database')


module.exports = {
    
    async get(req, res){
        knex('nurses').then((data) => {
            res.send(data)
        })
    },
    async create(req,res, next){
        try {
            const {username, phone, division} = req.body

            if(division != 'front' && division != "end"){
                return res.status(500).send('Division option not valid.')
            }

            if(username != '' && phone != '' && division != ''){
                await knex('nurses').insert({
                    nurseName: username,
                    phone: phone,
                    division: division
                })
    
                return res.status(201).send('Nurse ' + username + ' added.')
            } else {
                return res.status(500).send('Data not valid.')
            }
            
            
        } catch (error) {
            next(error)
        }
    },

    async update(req, res, next){
        try {
            const {username, phone, division} = req.body
            const {id} = req.params

            if(division != 'front' && division != "end"){
                return res.status(500).send('Division option not valid.')
            }

            if(username != '' && phone != '' && division != ''){
                await knex('nurses').update({
                    nurseName: username,
                    phone: phone,
                    division: division
                }).where({
                    nurseId: id
                })

                return res.status(200).send('Nurse name updated')
            } else {
                return res.status(500).send('Data not valid.')
            }
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

