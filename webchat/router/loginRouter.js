var express= require('express');
const bcrypt = require('bcrypt');
var router = express.Router();
const User= require('../model/user');
const jwt = require('jsonwebtoken');

var _ = require('lodash');

router.post('/',async (req,res)=>{   
    console.log(req.body) ;                                                  // login api, webtoken is created
try{             
    console.log("sent");                                                                       // (/api/login/)
    const user= await User.findOne({username:req.body.username})
    console.log(user);  
    if(user){
        console.log("sent2");
        const valid = await bcrypt.compare(req.body.password,user.password);            // use email for username
        if(!valid) return res.send({'data':'false'});
        try{
            console.log("sent1");
            console.log('generating token');
            const token =await jwt.sign({name:user.username,admin:user.isadmin},'privatekey');
            console.log("this is token"+token);
            console.log("sent");
            
            res.header('x-auth-token',token).send({
            data:'true',admin:user.isadmin
           });
           //res.redirect('http://192.168.43.92:8081/user.html')
           //res.json({"data":"true"});
                }
                catch(err){
                    console.log(err);
            
                };
            }
        else return res.send({'data':'usee not found'});
        
    }
    catch(err){
        console.log(err);
    }
});   

   
module.exports=router;

  
 

