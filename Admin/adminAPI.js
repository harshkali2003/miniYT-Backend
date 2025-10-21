require('dotenv').config()
const express = require('express')
const router = express.Router()

const video = require('../Models/videos')

router.post('/log' , async (req , resp)=>{
    try{
        const {email , password} = req.body
        if(!email || !password){
            return resp.status(400).json({message : "All fields are required"})
        }

        const isValid = email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD

        if(isValid){
            let data = {
                email : process.env.ADMIN_EMAIL ,
                password : process.env.ADMIN_PASSWORD
            }

            data = data.toObject()
            delete data.password

            resp.status(200).json({data})
        }else{
            return resp.status(403).json({message : "Invalid credentials"})
        }
    }catch(e){
        resp.status(500).json({message : "Internal server error"})
    }
})

router.delete('/delete/:id' , async(req , resp) =>{
    try{
        let data = await video.findByIdAndDelete({ _id: req.params.id })
        if(!data){
            return resp.status(400).json({message : "something went wrong"})
        }
        resp.status(200).json({message : "success" , data})
    }catch(e){
        resp.status(500).json({message : "Internal server error"})
    }
})

module.exports = router