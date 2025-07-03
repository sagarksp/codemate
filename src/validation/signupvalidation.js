const validator = require("validator")
const express = require("express");



const signupValidation =(req)=>{
   
    const {email, firstName, lastName, password} = req.body

    if(!firstName || !lastName){
    throw new Error("First and last name is needed")
}
else if(!validator.isEmail(email)){
    console.log("Invalid Email")
    throw new Error("Email is invalid")
}
// else if(!validator.isStrongPassword(password)){
//     throw new Error("Password is not strong")
// }
}
module.exports = signupValidation