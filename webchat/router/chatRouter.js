var express= require('express');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');
const auth = require('../config/authuser');
var router = express.Router();
const User= require('../model/user');
const app = express();
var _ = require('lodash');
var Chat = require('../model/chat');
router.post('/',async (req,res)=>{
    const chat = new Chat({

        
      });
})