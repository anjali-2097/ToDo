const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const validat = require("validator");
const userschema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter username"],
        minlength:4,
        maxlength:20,
        unique:true,
        trim:true,
    },
     email: {
        type: String,
        required: [true, "Please enter email"],
        validate: {
          validator: validat.isEmail,
          message: "Please enter a valid email",
        },
        unique: true,
      },
      lastActive:{
        type:Date,
        default:Date.now
      },
      profilePicture: {
        type: String,
        default:
          "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
      },
  
    
});

const GoogleUserModel=mongoose.model("Googleuser",userschema);
module.exports=GoogleUserModel;