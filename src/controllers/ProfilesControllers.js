const knex = require('../database')


module.exports = {
    async index(req, res) {
        await res.status(200).send('Welcome to Brace Guardin API demo. For more information go <a href="https://highfalutin-dianella-6df.notion.site/Demo-API-Documentation-61249c405579447b871b703105d5c85c">here</a>.')
    }, 
    async get(req, res){
        let total_falls_count = []
        let today_falls_count = []
        let yesterday_falls_count = []
        let battery_levels = []
        var today = new Date();
        var dateToday = today.getDate() +'/0'+(today.getMonth()+1)+'/'+ today.getFullYear();
        var dateYesterday = (today.getDate()-1) +'/0'+(today.getMonth()+1)+'/'+ today.getFullYear();
        knex('profiles').then(async (data) => {
            //console.log(data[0])
            for (let index = 0; index < data.length; index++) {
                let falls = await knex('patient_data').where({profileId: data[index].profileId}).select('created_at')
                //console.log(falls)
                total_falls_count.push(falls.length)
                let today_count = 0
                let yesterday_count = 0
                for (let i = 0; i < falls.length; i++) {
                    console.log(falls[i].created_at.toLocaleString() + ', ' + dateToday )
                    if(falls[i].created_at.toLocaleString().includes(dateToday)){
                        today_count++
                        //console.log('+1 today')
                    } else if (falls[i].created_at.toLocaleString().includes(dateYesterday)){
                        yesterday_count++
                        //console.log('+1 yesterday')
                    }
                    
                }
                today_falls_count.push(today_count)
                yesterday_falls_count.push(yesterday_count)
                battery_levels.push(data[index].battery)
                //console.log(falls.length + ', ' + today_count + ', ' + yesterday_count)
                today_count = 0
                yesterday_count = 0
                
            }
            let response = []
            //console.log(falls)
            for (let index = 0; index < data.length; index++) {
                response.push({id: data[index].profileId, name: data[index].profileName, totalFalls: total_falls_count[index], todayFalls: today_falls_count[index], yesterdayFalls: yesterday_falls_count[index], battery_level: battery_levels[index]})
                
            }

            res.status(200).send(response)
        })
    },
    async create(req,res, next){
        try {
            const {username} = req.body
            
            await knex('profiles').insert({
                profileName: username,
                battery: '-'
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

