const mongoose = require('mongoose')
const contactData = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : false
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    query : {
        type : String,
        required : true,
        unique : false
    }
})

module.exports = mongoose.model("ContactData" , contactData)