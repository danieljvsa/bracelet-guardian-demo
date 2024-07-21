const knex = require('../database');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

module.exports.get = async (req, res) => {
    return res.send({success: true, data: req.alert})
}

module.exports.getAll = async (req, res) => {
    return res.send({success: true, data: req.alerts})
}

module.exports.create = async (req, res) => {
    const {battery, distance, address} = req.body
    if(typeof battery !== "string" && typeof distance !== "string" && typeof address !== "string") return res.send({success: false, error: "Missing address | battery | distance"})
    
    try {
        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = (today.getHours()+1) + ":" + today.getMinutes() + ":" + today.getSeconds();
        
        await knex('nurses').where({orgId: req.patient.orgId}).then((data) => {
            console.log(data)
            for (let index = 0; index < data.length; index++) {
                client.messages.create({
                    body: 'Alert: ' + req.patient.patientName + ' has fallen at ' + time + ' of ' + date + ' at ' + distance + ' meters from antena. Its room ' + address + '.',
                    from: 'whatsapp:' + process.env.TWILIO_WHATSAPP ,
                    to: 'whatsapp:' + data[index].phone
                }).then().done();
                
            }
        })

        await knex('alerts').insert({
            distance: distance,
            address: address,
            active: true,
            braceletId: req.bracelet.braceletId,
            patientId: req.patient.patientId
        })
        
        await knex('bracelets').where({braceletId: req.bracelet.braceletId}).update({
            battery: battery
        })

        return res.send({success: true, data: req.bracelet.braceletId})
    } catch (error) {
        console.log("controllers/alerts/create: ", error)
        return res.send({success: false, error: error})
    }
}