require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const app=express();
const cors = require("cors");
const bodyParser=require('body-parser');
const authroute=require('./routes/authroute');
const passport=require("passport");
app.use(cors());
app.use(bodyParser.json()); 
app.use(express.json());
require("dotenv").config();
app.use(passport.initialize());

app.use("/",authroute);
const connector=async ()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/Auth?readPreference=primary&directConnection=true&ssl=false",{
            useNewUrlParser: true, 
            useUnifiedTopology: true
         })
       
        app.listen(8080,()=>{
            console.log("app is started at 8080!!!");
        })
    }
    catch(e){
        console.log("error: ",e);
    }


}
connector();