const mongoose = require('mongoose')
const commentData = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : true
    },
    video : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "videos",
        required : true
    },
    comment : {
        type : String,
        required : true,
        trim : true
    },
} , {timestamps : true})

module.exports = mongoose.model("Comments" , commentData)