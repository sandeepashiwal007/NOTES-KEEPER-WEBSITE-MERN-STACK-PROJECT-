const express=require('express')
const User=require('../models/User.js');
const router=express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
let fetchuser=require('../middleware/fetchuser.js')
const JWT_SECRET ='SandeepAshiwal';
router.post('/createuser',[
    body('name','enter a valid name').isLength({min:5}),
    body('email','enter a valid email').isEmail(),
    body('password','enter a valid password').isLength({min:5}),
    ],async(req,res)=>{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    try{

      let user=await User.findOne({email: req.body.email});
      if(user){
        return res.status(400).json({error:"sorry a user with this email alrerady exist"});
      }
      const salt= await bcrypt.genSalt(10);
      const seqPassword=await bcrypt.hash(req.body.password,salt);
      user=await User.create({
        name: req.body.name,
        email: req.body.email,
        password: seqPassword
      })  
      const data={
        user:{
          id:user.id
        }
      }
      const jwt_data=jwt.sign(data,JWT_SECRET);
      console.log(jwt_data);
      res.json({jwt_data}); 
    }catch(err){
        console.error(error.message);
        res.status(500).json({error:"something went wrong"});
    }
    })


    router.post('/login',[
      body('email','enter a valid email').isEmail(),
      body('password','enter a valid password').exists()
      ],async(req,res)=>{
        let success=false;
        const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
      
          const {email,password}=req.body;
          try{
            let user=await User.findOne({email});
            if(!user){
              success=false;
              return res.status(400).json({error:"please check your credentials"});
            }
            const password_compare=await bcrypt.compare(password,user.password);
            if(!password_compare){
              success=false;
              return res.status(400).json({error:"please check your credentials"});
            }
            const data={
              user:{
                id:user.id
              }
            }
            const jwt_data=jwt.sign(data,JWT_SECRET);
            console.log(jwt_data);
            res.json({jwt_data});
            success=true;
            res.json({success,jwt_data})
          }catch(error){
            console.error(error.message);
            res.status(500).json({error:"something went wrong"});
          }
        }
      )

          router.post('/getuser', fetchuser,  async (req, res) => {

            try {
              userId = req.user.id;
              const user = await User.findById(userId).select("-password")
              res.send(user)
            } catch (error) {
              console.error(error.message);
              res.status(500).send("Internal Server Error");
            }
          })
 module.exports=router