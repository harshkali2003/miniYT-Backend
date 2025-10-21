const express = require('express')
const router = express.Router()

const contact = require('../Models/contact')

router.post('/create' , async (req , resp)=>{
    try{
        const {name , email , query} = req.body
        if(!name || !email || !query){
            return resp.status(400).json({message : "all fields are required"})
        }
        let existingEmail = contact.find({email})
        if(existingEmail){
            return resp.status(403).json({message : "already contacted earlier"})
        }

        let data = await contact({
            name ,
            email ,
            query
        })
        data = await data.save()
        if(!data){
            return resp.status(403).json({message : "something went wrong"})
        }

        resp.status(201).json({message : "success" , data})
    }catch(e){
        resp.status(500).json({message : "Internal server error"})
    }
})

router.get('/list' , async(req , resp)=>{
    try{
        let data = await contact.find()
        if(!data){
            return resp.status(403).json({message : "something went wrong"})
        }
        
        resp.status(200).json(data)
    }catch(e){
        resp.status(500).json({message : "Internal server error"})
    }
})

module.exports = router