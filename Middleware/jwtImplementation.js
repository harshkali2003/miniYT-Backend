const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwt_secret_key = process.env.JWT_SECRET_KEY

function generateToken(user){
    return jwt.sign({_id : user._id , email : user.email} , jwt_secret_key , {expiresIn : "12h"});
}

function verifyToken(req , resp , next){
    let token = req.headers["authorization"]
    if(!token){
        return resp.status(401).json({message: "Access denied. Token missing."})
    }
    token = token.split(" ")[1]
    jwt.verify(token , jwt_secret_key , (err , valid) =>{
        if(err){
            return resp.status(403).json({ message: "Invalid or expired token."})
        }

        req.user = valid
        next()
    })
}

module.exports = {generateToken , verifyToken}