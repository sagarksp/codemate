const mongoose = require("mongoose");

const connectDB = async ()=>{
    try{
        await mongoose.connect("mongodb+srv://kspsagar02:68Hzfb07jPOsthL9@database.ocbai.mongodb.net/codemate")
        console.log("db connected")
    }catch(err){
        throw new Error("something went wrong" + err)
    }
}

module.exports = connectDB