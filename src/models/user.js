const mongoose = require("mongoose");

//checking type of array must be string and after trim its must contain 1 value array cant be empty
function skillsValidation(skillsArray) {
  for (let i = 0; i < skillsArray.length; i++) {
    if (typeof skillsArray !== "string" || skillsArray[i].trim().length === 0) {
      return false;
    }
  }
  return true;
}


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "firstName is required"],
  },
  lastName: {
    type: String,
    required: [true, "LastName is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [4, "Password must be at least 4 characters"],
   
  },
  about: {
    type: String,
    trim: true,
    maxlength: [200, "About can't be more than 200 characters"],
    default: "I am a developer happy to connect with you",
  },
  skills: {
    type: [String],
    default: [],
    validate: [skillsValidation, "skills must be non empty and string arrays"],
  },
  photourl: {
    type: String,
    default: "",
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    enum: {
      values: ["male", "female", "others"],
      message: "Gender must be male, female, or others",
    },

    //  validate(value){
    //     if(!["male","female","others"]){
    //         throw new Error("gender must be male female ")
    //     }
    // }
  },
},{
    timestamps:true
});

module.exports = mongoose.model("User", userSchema);
