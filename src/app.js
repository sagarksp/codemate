const express = require("express");
const connectDB = require("./config/database");
const User = require("../src/models/user")
const bcrypt = require("bcrypt");
const signupValidation = require("../src/validation/signupvalidation")
const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser")
const {userAuth} = require("../src/middlewares/auth")
const cors = require("cors")

 
const app = express();
app.use(cookies())
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173", // frontend
  credentials: true // if using cookies
}));

app.post("/signup",async (req,res)=>{

   
    try{
        signupValidation(req)
        const {firstName, lastName, email,password} = req.body;

        //check if user is exist
        const userExist = await User.findOne({email})
        if(userExist){
          return  res.status(400).json({message:"user already exist"})
        }

        //hash password 
        const hashPassword = await bcrypt.hash(password, 10)

        //create user
        const user = await User.create({firstName, lastName, password:hashPassword, email})
await user.save()
      res.send("user add")

    }catch(err){
        res.status(401).send(err)
    }
    
})

app.get("/user/:id",async(req,res)=>{

    const {email} = req.body;
    
    
    const {id} = req.params
    console.log(req.body)
    

    try{
        const userExist = await User.findById({_id : id})
        console.log(id)

        if(userExist){
            console.log(email)
            res.send(userExist)
        }
      
    

    }catch(err){
        res.status(400).json({message:"User not foumd go and signup "})
    }
})

app.get("/feed", async(req,res)=>{
    try{
        const users = await User.find({})
        res.send(users)

    }catch(err){
        res.status(400).json({message:"Something went wrong "})
    }
})

app.delete("/delete", async(req,res)=>{
    const userId=req.body.id
    try{
         const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.send("Deleted successfully");
    }catch(err){
        res.status(400).json({message:"something went wrong during user deletion "})
    }
})

// app.patch("/user", async (req,res)=>{
   
//     const {id, ...data} = req.body;
// //   const data = {
// //     firstName:req.body.firstName,
// //     lastName:req.body.lastName,
// //     email:req.body.email
// //   }
// //     const id = req.body.id

//     try{
//         const user = await User.findByIdAndUpdate(id, data)
//         res.send("User updated sucessfully")


//     }catch(err){
//         res.status(400).json({message:"something went wrong during user deletion "})
//     }
// })

app.patch("/user", async (req,res)=>{
    const {id, ...data} = req.body;

    try{
         // ✅ Only these fields are allowed to be updated
    const allowedUpdates = ["photourl", "about", "gender", "age", "firstName", "lastName"];

    // ✅ Check if all keys in `data` are allowed
    const isValidUpdate = Object.keys(data).every((key) => allowedUpdates.includes(key));
    
    const user = await User.findByIdAndUpdate(id,data)
    res.status(200).send("User updated sucessfully")

    // ❌ If user tries to update anything not allowed
    if (!isValidUpdate) {
      return res.status(400).json({ message: "Invalid fields in update request" });
    }
    }catch(err){
        res.status(401).send("need to check updation shows some error contact support if not solved" + err)
    }
})

//profile api

app.get("/profile",userAuth, async(req,res)=>{

    try{
         const user = req.user

   res.send(user)
    
    }catch(err){
        res.status(501).send("something went wrong")
    }
   
})

app.post("/sendConnection",userAuth, async (req,res)=>{

    try{
        const user = req.user;
        res.send(user.firstName + "sent request ")
    }catch(err){
         res.status(501).send("something went wrong")
    }
   
})


//login api
app.post("/login", async (req,res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email:email});

        if(!user) {
            throw new Error("User not available or credentials invalid")
        }
    
      //  ✅ user is the actual document retrieved from MongoDB, so user.password is the hashed password stored in the DB.
        const checkPassword = await bcrypt.compare(password, user.password)

        if(checkPassword){
            const token = await jwt.sign({_id:user._id},"DEV", {expiresIn:"1d"});
            res.cookie("token",token, {
                expires:new Date(Date.now() + 8 + 3600000)
            });
            // res.status(200).send("Login Sucessfully"
            // Express example
res.status(200).send(user);

        }

    }catch(err){
        res.status(500).send("sopmething wrong during login " + err)
    }
})

//cookies vrification api 
app.get("/verify",async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401); // Not logged in

  try {
    const user = jwt.verify(token, "DEV");
    res.status(200).json(user); // Or user info
  } catch (err) {
    res.sendStatus(401);
  }
});


app.post("/logout", async(req,res)=>{
    res.cookie("token",null, {
      expires: new Date(Date.now())
    }).send("user logout sucessfully ")
})

connectDB().then(()=>{
    app.listen(7777,()=>{
        console.log("7777 port")
    })
}).catch((err)=>{
    console.log("error" + err)
})