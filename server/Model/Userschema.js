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
    password:{
        type:String,
        required:[true,"Please enter username"],
        minlength:6,
        select:false
    }, email: {
        type: String,
        required: [true, "Please enter email"],
        validate: {
          validator: validat.isEmail,
          message: "Please enter a valid email",
        },
        unique: true,
      },
      profilePicture: {
        type: String,
        default:
          "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
      },
      lastActive:{
        type:Date,
        default:Date.now
      }
    
});
userschema.pre("save",async function(){
    if(!this.isModified("password"))
    return;
    const salt = await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
});
const UserModel=mongoose.model("User",userschema);
module.exports=UserModel;