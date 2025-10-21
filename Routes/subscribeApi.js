const express = require('express')
const router = express.Router()

const subscribers = require('../Models/subscribe')

router.post('/new' , async (req , resp) =>{
    try{
        let {email} = req.body
        if(!email){
            return resp.status(400).json({message : "Please provide email"})
        }

        let data = await subscribers({
            email
        })

        data = await data.save()

        if(!data){
            return resp.status(400).json({message : "something went wrong"})
        }

        resp.status(201).json({message : "success" , data})
    }catch(e){
        resp.status(501).json({message : "Internal server error"})
    }
})

router.get('/get' , async (req , resp) =>{
    try{
        let data = await subscribers.find()
        if(!data){
            return resp.status(400).json({message : "something went wrong"})
        }

        resp.status(200).json(data)
    }catch(e){
        resp.status(501).json({message : "Internal server error"})
    }
})

module.exports = router