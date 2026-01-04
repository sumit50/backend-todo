// import mongoose from "mongoose";

// import jwt from "jsonwebtoken"
// import bcrypt from "bcrypt"
// import User from "../models/login";


// //register


// export const regitsre = async(req, res)=>{

// try {


//     const {name, email, password} = req.body; 

//     // check empty feilds 

//     if  (!name || !email || !password) {
//         return res.status(400).json({message: "all feilds are required "});
//     }

// }

// // validate emaial format 
// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//  if (
//     !emailRegex.test(email)){
//         return res.status(400).json({message :"invaild email"})

//     }
// }



// const oldUser = await User.findOne({email});

// if (oldUser) {

//     return res.status(409).json({message:"user alreday exist"})
// }

// const hashpassword = await bcrypt.hash(password, 10);

// const createUser = await User.create({
//     name, email, password:hashedPassword, 

// }), 


// const tooken = jwt.sign (

//     {
//         id:newUser._id, 
//         email:newUser.email, 
//         name:newUser.name, 

//     },

//     process.env.JWT_SECRET, 
//     {epiresIn :"7d"}
// )
// ;


// // response


// res.status(201).json ({

// message :"user regitsre susscefully "

// tooken, 

// user :{
//     id:newUser._id, 
//     name:newUser.newUser.email, 
// }, 


// })
// catch (err){
//     console.error(err); 
//         res.status(500).json({message:"server error", error:err.message}, )

// }

