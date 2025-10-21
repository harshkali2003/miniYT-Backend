const mongoose = require('mongoose')
const usersData = new mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    phone_no : {
        type : Number
    },
    filename : {
        type : String
    }
})

module.exports = mongoose.model('USERS' , usersData)