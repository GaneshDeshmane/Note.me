const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {UserModel,NoteModel,PhotoModel}=require('./db')
const {z} = require('zod');
const cors = require('cors')
const path = require('path')
const {authMiddleware} = require('./authMiddleware');
require('dotenv').config()
const JWT_SECRET =process.env.JWT_SECRET;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use(express.json())
const UserRequirement =z.object({
    name : z.string(),
    email : z.string().email(),
    password :z.string().min(6)
})
app.post('/signup',async function(req,res){
    const Parsedata = UserRequirement.safeParse(req.body)
    if(!Parsedata.success){
        return res.json({
            msg : "validation error"
        })
    }
    const existingUser = await UserModel.findOne({
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
        email : z.string().email(),
        password:z.string().min(6)
    })
    const Parsedata = SigninRequired.safeParse(req.body)
    if(!Parsedata.success){
             return res.status(400).json({
            msg : 'validation error',
            error : Parsedata.error.errors
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
          

app.post('/notes',authMiddleware,async function(req,res){
   const { title, content } = req.body;

await NoteModel.create({
    title,
    content,
    userId: req.user_Id
});
res.json({
    msg : 'notes created successfully'
})

})
app.post('/photos',authMiddleware,async function(req,res){
   
    const user_Id = req.user_Id
    const photo = req.body.photo
    try{
    const photoNew = await PhotoModel.create({
            url: req.body.url,
            userId: req.user_Id
        });
    res.json({
        msg : 'photo stored'
    })
}catch(err){
    res.status(500).json({
            msg: "failed to create photo",
            error: err.message})
}
})
app.get('/notes', authMiddleware, async function(req, res) {
    const userId = req.user_Id;

    const notes = await NoteModel.find({
        userId: userId
    });

    res.json({
        notes
    });
});

app.get('/photos',authMiddleware,async function(req,res){
        const userId = req.user_Id;

    const photo = await PhotoModel.find({
        userId: userId
    });

    res.json({
        photo
    });
})
app.listen(3000);