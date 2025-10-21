const mongoose = require('mongoose')

const subscribeData = new mongoose.Schema({
    email : {
        type : String,
        unique : true,
        required : true
    }
})

module.exports = mongoose.model('subscribers' , subscribeData)