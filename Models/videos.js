const mongoose = require('mongoose')
const videoMetaData = new mongoose.Schema({
    title : {
        type : String
    },
    description : {
        type : String
    },
    hashtags : {
        type : [String],
        default : []
    },
    views : {type : Number , default : 0},
    uploadedBy : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'USERS'
    },
    filename : {
        type : String
    },
    uploadedAt : {
        type : Date ,
        default : Date.now
    }
})

module.exports = mongoose.model("VIDEOS" , videoMetaData)