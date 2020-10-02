var express= require('express');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');
const auth = require('../config/authuser');
var router = express.Router();
const User= require('../model/user');
const app = express();
var _ = require('lodash');

router.post('/',async (req,res)=>{
 var a = req.body.password.length;
 console.log("inside the post route of register route");
  const users =  await User.findOne({username:req.body.username});                //registration for users.
  if(users) return (res.status(400).send('username aleady exists')); 
  if(a<6) return (res.status(400).send('enter the password length of 6'));
  const user = new User({
    name:req.body.name,
    username:req.body.username,
    password:req.body.password,
    dept:req.body.dept,
    isadmin:false,
    connect:false,
    clientId:{"this":"null"},
    
  });
  const salt= await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(user.password,salt);
  user.password=hashed;
  try{
      user.save().then(()=>{
         
         console.log('yay');
        return res.send('registered');
         // res.redirect('/',);
      })
  }
  catch(err){
      console.log(err);
  }

})
module.exports=router;