var express = require('express');
const jwt= require('jsonwebtoken');
const auth = require('../config/authuser');
var router = express.Router();
const User= require('../model/user');
const app = express();
var _ = require('lodash');
var mailer=require('nodemailer');

router.post('/',async (req,res)=>{
    console.log(req.body);
    User.find({connect:true},'username').then((mail)=>{
        var id='';
        for(var i=0;i<mail.length;i++)
        {
           id+=mail[i].username;
         if(i!=mail.length-1) id+=',';
        }
        //////////////////////////////

var transporter = mailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:465,
    secure:false,
    auth:{
        user:'ashish.aryan099@gmail.com',
        pass:'8969675310'
        },
    
});
var mailOption={
    from : 'ashish.aryan099@gmail.com',
    to : id.split(","),
    subject: req.body.subject,
    text : req.body.content
};
transporter.sendMail(mailOption,function(err,info){
    if(err)
      console.log(err);
    else {console.log(info.response);
        res.end('success');
    }

})
        /////////////////////////////
        console.log(id);
        //res.send('successfully sent');
    }).catch((err)=>{
        console.log(err);
    });
});
module.exports= router;



