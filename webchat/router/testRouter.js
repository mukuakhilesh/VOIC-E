var express= require('express');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');
const auth = require('../config/authuser');
var router = express.Router();
const User= require('../model/user');
const app = express();
var _ = require('lodash');

router.post('/',async (req,res)=>{
    User.find({connect:true},'username').then((mail)=>{
        res.send(mail);
    }).catch((err)=>{
        console.log(err);
    });
});
module.exports= router;