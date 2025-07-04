const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async(req, res, next)=>{
    const cookies = req.cookies;
    const{token}= cookies;

    if(!token){
        res.send("Invalid token")
    }

    const decodeObj = await jwt.verify(token, "DEV");

    const {_id} = decodeObj
    
    const user = await User.findById({_id})
    if(!user){
        res.send("user not found ")
    }

    req.user = user;
    next()
}

module.exports = {userAuth}