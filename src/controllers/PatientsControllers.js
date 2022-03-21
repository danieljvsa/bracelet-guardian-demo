const knex = require('../database')
require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


module.exports = {
     
    async get(req, res){
        const {id} = req.params
        knex('patient_data').where({profileId: id}).then((data) => {
            res.send(data)
        })
    },
    async create(req, res, next){
        let isValid = false
        let id = 0
        let phones = []
        try {
            const {level, locationX, locationY, macAddress} = req.body
            //const {id} = req.params

            if(macAddress != ''){
                await knex('bracelets').where({macAddress: macAddress}).then((data) => {
                    if(data.braceletId != 0){
                        isValid = true
                        id = data.profileId
                    } else{
                        res.send('Bracelet is not valid.')
                    }
                })
            }

            if(isValid != false){
                if(locationX != '' && locationY != '' && id != '' && level != ''){
                    await knex('patient_data').insert({
                        level: level,
                        locationX: locationX,
                        locationY: locationY,
                        profileId: id
                    })

                    await knex('nurses').then((data) => {
                        res.send(data)
                    })

                    client.messages.create({
                        body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
                        from: process.env.TWILIO_PHONE_NUMBER ,
                        to: '+351914906145'
                    })
                    .then(message => console.log(message.sid));

                    return res.status(200).send('Alert to nurses was sent!!')
                }
                return res.status(500).send('Information is not valid.')
            } else {
                return res.status(500).send('Information is not valid.')
            }
            

            
        } catch (error) {
            next(error)
        }
    },

    async delete(req, res, next){
        try {
            //const {id} = req.params
            let id = 0
            const {macAddress} = req.body

            if(macAddress != ''){
                await knex('bracelets').where({macAddress: macAddress}).then((data) => {
                    if(data.braceletId != 0){
                        isValid = true
                        id = data.profileId
                    } else{
                        res.send('Bracelet is not valid.')
                    }
                })
            }

            await knex('patient_data').where({
                dataId: id
            }).del()

            return res.send('Alert deleted')

        } catch (error) {
            next(error)
        }
    }
    
}