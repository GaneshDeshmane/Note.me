const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {UserModel,NoteModel,PhotoModel}=require('./db')
const {z, email, minLength} = require('zod')
const JWT_SECRET =process.env.JWT_SECRET
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
app.post('/signin',function(req,res){
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
    
})
           

app.post('/notes',function(req,res){
    
})
app.post('/photos',function(req,res){
    
})
app.get('/notes',function(req,res){

})
app.get('/photos',function(req,res){

})
app.listen(3000);