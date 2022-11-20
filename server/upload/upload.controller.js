const service = require('./upload.service');
const fs = require('fs');
const path =require('path');


exports.addImage = async (req, res, next) => {
    try {
        const id = req.body.id;
        console.log("add image", req.body);
        const image = req.file;
        const label = req.body.label;
        const data = await service.addImage(id, image, label);
        return res.status(200).send({ "msg": "success", "response-msg": data });
    } catch (err) {
        console.log(err);
    }
};

exports.changeImage = async (req, res, next) => {
    try {
        const id = req.body.id;
        const image = req.file;
        console.log('changeImage', req.body,'....',req.body.file);
        const data = await service.changeImage(id, image);
        return res.status(200).send({ "msg": "update success", "response-msg": data });
    } catch (err) {
        return err;
    }
};

exports.getImage = async (req, res, next) => {
    try{
        const id = req.query.id;
        const image =[];
        const data = await service.getImage(id);
        data.reverse();
        for(const element of data){
            image.push(element.label);
              
        }
        return res.send(data);
        //return res.status(200).send({ "msg": "success", "response-msg": data });
    }catch(err){
        return (err);
    }
};

exports.searchImage = async (req, res, next) => {
    try{
        const label = req.query.label;
        const image = [];
        const data = await service.searchImage(label);
        for(const element of data){
            image.push(element.label);
              
        }
        return res.send(data);
    }catch(err){
        return (err);
    }
};

exports.deleteImage = async (req,res,next)=>{
    try{
        const id = req.query.id;
        const data = await service.deleteImage(id);
        return res.status(200).send({ "msg": "success", "response-msg": data });
    }catch(err){
        return err;
    }
};