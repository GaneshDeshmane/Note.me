const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {UserModel,NoteModel,PhotoModel}=require('./db')
const {z, email, minLength} = require('zod');
const {authMiddleware} = require('./authMiddleware');

const JWT_SECRET =process.env.JWT_SECRET;
process.config()
const app = express();
const UserRequirement =z.object({
    name : z.string(),
    email : z.email(),
    password :z.string(minLength(6))
})
app.post('/signup',async function(req,res){
    const Parsedata = UserRequirement.safeParse(req.body)
    if(!Parsedata.success){
        return
        res.json({
            msg : "validation error"
        })
    }
    const existingUser = UserModel.findOne({
        email : Parsedata.data.email
    })
    if(existingUser){
            return res.json({
            msg : 'user already exist'
        })
    }
    try{
            await UserModel.create({
                email : Parsedata.data.email,
                name : Parsedata.data.name,
                password : Parsedata.data.password
        })
        res.json({
            msg : 'youre signedup successfull'
        })
    }catch(err){
        res.json({
            err : err.message,
            msg : 'error creating user'
        })
    }
})
app.post('/signin',async function(req,res){
    const SigninRequired = z.object({
        email : z.email(),
        password:z.string(minLength(6))
    })
    const Parsedata = SigninRequired.safeParse(req.body)
    if(!Parsedata.success){
             return res.status(400).json({
            msg : 'validation error',
            error : parseData.error.errors
        })
        
    }
    let checkUser ;
    try{
        checkUser= await UserModel.findOne({
        email : Parsedata.data.email,
        password : Parsedata.data.password
    })}
    catch(err){
        return res.status(400).json({
            msg : 'error occurred while signing in',
            error : err.message
        })
    }
         if(!checkUser){
        return res.status(400).json({
            msg : 'invalid credentials'
        })
     }
        const token = jwt.sign({user_Id : checkUser._id},JWT_SECRET)
        res.json({
            msg : 'signedin successfully',
            token:token
        })

    
    
})
          

app.post('/notes',authMiddleware,function(req,res){
    
})
app.post('/photos',authMiddleware,function(req,res){
    
})
app.get('/notes',authMiddleware,function(req,res){

})
app.get('/photos',authMiddleware,function(req,res){

})
app.listen(3000);