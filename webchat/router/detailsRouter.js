var express= require('express');
const auth = require('../config/authuser');
var router = express.Router();
const User= require('../model/user');

var _ = require('lodash');


router.get('/',auth,async(req,res)=>{
  try{
    console.log('here');
  const user =  await User.findOne({username:req.user.name},'username name dept date connect')  ;      // get the details of each user i.e session page for user
  if(!user) return(res.send('details not found'));      // (/api/me)
  res.json(user);
  }
  catch(err){
    console.log(err);
  }

})
 module.exports = router ;



