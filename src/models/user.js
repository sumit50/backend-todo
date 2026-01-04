import mongoose from "mongoose";

const userSchema = new mongoose.Schema(


    {

        name :String, 
        email:{
            type:String, unique:true
        }, 
        googleId:{
            String, 
            avatar:String
        }, 
    }, 
        {timestamps:true}, 
    
)