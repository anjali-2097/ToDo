const User=require('../Model/Userschema');
const Googleuser=require('../Model/Googleuser');
const ToDoList=require('../Model/ToDo');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const {ObjectId}=require('mongoose').ObjectId;
const mongoose=require('mongoose');

const usercreation=async (req,res)=>{
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res
            .status(400)
            .json({
                success:false,
                message:"please provide all credential"
            })
        }
        const userexists=await User.findOne({email})
        .clone()
        .catch(function (err) {
          console.log(err);
        });
        if(userexists){
            return res.status(400).json({
                sucess: "false",
                message: "User with this credential already exists please log in..",
              });
        }
        try{
            const lastActive=new Date();
            const newuser=await User.create({name,email,password,lastActive});
            newuser.password=undefined;
            
            jwt1={userID:newuser._id,userl:"website"}
            const token=jwt.sign(jwt1,process.env.JWT_SECRET,{ 
                expiresIn: process.env.JWT_LIFETIME,
              });
              
            res.status(200).json({user:newuser,token});
        }
        catch(err){
            console.log("error: ",err);
            res.status(500).json(err.message);
        }
}
const userlogin=async (req,res,next)=>{
    try{
    const {email,password}=req.body;
    if( !email || !password){
        return res
        .status(400)
        .json({
            success:false,
            message:"please provide all credential"
        })
    }
    let existuser=await User.findOne({email})
    .select("+password")
    .clone()
    .catch(function(err){
        console.log(err);
    })
    if(!existuser){
        
        return res.status(400).json({
            sucess: "false",
            message: "please enter valid credential",
          });
    }
    const passwordcheck=await bcrypt.compare(
        password,
        existuser.password
    );
    if(!passwordcheck){
        return res.status(400).json({
            sucess: "false",
            message: "please enter valid credential",
          });
    }
    const lastActive=new Date();
    existuser=await User.findOneAndUpdate({email},{lastActive},{
        new: true
      });
    existuser.password=undefined;
    jwt1={userID:existuser._id,userl:"website"}
    const token=jwt.sign(jwt1,process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_LIFETIME
    })
    res.json({user:existuser,token});
}
catch(err){
 
    console.log("error: ",err);
    res.status(500).json(err.message);
}

}
const getUser=async (req,res)=>{
  const id=req.user.userId;
  id.toString();
    if(req.user.userl=="website"){
    let existuser=await User.findById(id)
    .clone()
    .catch(function (err) {
      console.log(err);
    });
    if(!existuser){
        return res.status(400).json("user doesnotexist relogin");
       
    }
    const lastActive=new Date();
  existuser=await User.findByIdAndUpdate(id,{lastActive},{
    new: true
  }) ;
  if(existuser.password){
    existuser.password=undefined;
  }
    console.log("existuser");
    console.log(existuser);
    return res.status(200)
    .json({user:existuser});
}
else{
    let existuser1=await Googleuser.findById(id)
    .clone()
    .catch(function (err) {
      console.log(err);
    });
    if(!existuser1){
        return res.status(400).json("user doesnotexist relogin");
       
    }
    const lastActive=new Date();
    existuser1=await Googleuser.findByIdAndUpdate(id,{lastActive},{
      new: true
    }) ;
   
    console.log(existuser1);
    return res.status(200)
    .json({user:existuser1});
}
}
const googleusercreation=async (req,res)=>{
    const {name,email,profile}=req.body.user_profile;
    if(!name || !email ){
        return res
        .status(400)
        .json({
            success:false,
            message:"please provide all credential"
        })
    }
    const userexists=await Googleuser.findOne({email})
    .clone()
    .catch(function (err) {
      console.log("here");
      console.log(err);
    });
    if(!userexists){
        try{
            const lastActive=new Date();
            const newuser=await Googleuser.create({name,email,profilePicture:profile,lastActive});
            const token=jwt.sign({userID:newuser._id,userl:"google"},process.env.JWT_SECRET,{ 
                expiresIn: process.env.JWT_LIFETIME,
              });
            res.status(200).json({user:newuser,token});
        }
        catch(err){
            console.log("error: ",err);
            res.status(500).json(err.message);
        }
    }
    else{
        const token=jwt.sign({userID:userexists._id,userl:"google"},process.env.JWT_SECRET,{ 
            expiresIn: process.env.JWT_LIFETIME,
          });
        res.status(200).json({user:userexists,token});
    }
   
}
const userUpdatation=async (req,res)=>{
    console.log(req.body);
    const id=req.user.userId;
    id.toString();
    const {name,email,profilePicture}=req.body.user;
    
    if(!name || !email || !profilePicture){
        return res
        .status(400)
        .json({
            success:false,
            message:"please provide all details"
        })
    }
    const update={name:name,email,profilePicture};
    if(req.user.userl=="website"){
        let existuser=await User.findById(id)
        .clone()
        .catch(function (err) {
          console.log(err);
        });
        if(!existuser){
            return res.status(400).json("user doesnotexist relogin");
           
        }
        existuser=await User.findByIdAndUpdate(id,{...update},{new: true});
      if(existuser.password){
        existuser.password=undefined;
      }
        console.log("existuser");
        console.log(existuser);
        return res.status(200)
        .json({user:existuser});
    }
    else{
        let existuser1=await Googleuser.findById(id)
        .clone()
        .catch(function (err) {
          console.log(err);
        });
        if(!existuser1){
            return res.status(400).json("user doesnotexist relogin");
           
        }
        existuser=await Googleuser.findByIdAndUpdate(id,{...update},{new: true});
        console.log(existuser1);
        return res.status(200)
        .json({user:existuser1});
    }
}
const saveToDo=async (req,res)=>{
  const todoitems = req.body.newToDoList;
  if((req.user.userl = 'google') || (req.user.userl = 'website')){
    if(!(req.body.newToDoList)){
      return res
        .status(400)
        .json({
            success:false,
            message:"Unable to get ToDo List",
        })
    }else{
      const id=req.user.userId;
      id.toString();
      let todoexists =await ToDoList.findOne({userId: id}).exec();
      if (!todoexists) {
        await ToDoList.create({
          userId: id,
          todos: todoitems,
        })
      }else{
        todoexists.todos = todoitems;
        await todoexists.save();
      }
      res.json(todoitems)
    }
  }
}
const getToDo=async (req,res)=>{
  const id=req.user.userId;
  id.toString();
    if(req.user.userl=="website"){
    let existuser=await User.findById(id)
    .clone()
    .catch(function (err) {
      console.log(err);
    });
    if(!existuser){
        return res.status(400).json("user doesnotexist relogin");
    }
    let todoexists =await ToDoList.findOne({userId: id}).exec();
      if(todoexists){
        return res.status(200)
        .json({todos:todoexists.todos});
      }
}
else{
    let existuser1=await Googleuser.findById(id)
    .clone()
    .catch(function (err) {
      console.log(err);
    });
    if(!existuser1){
        return res.status(400).json("user doesnotexist relogin");
    }
    let todoexists =await ToDoList.findOne({userId: id}).exec();
    if(todoexists){
      return res.status(200)
      .json({todos:todoexists.todos});
    }  
}
}
module.exports={usercreation,userlogin,getUser,googleusercreation,userUpdatation,saveToDo,getToDo}