var mongoose= require('mongoose');
var validator = require('validator');
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:3,
        max:10,
    },
    username:{
        type:String,
        required:true,
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false
          }
    },                      // email as username
    password:{
        type:String
    },
    dept:{
        type:String,
        // enum:['dept1','dep2','dept3','dept4'],
        required:true,
    },
    clientId:{
        type:Object,
    },
    isadmin:{
        type:Boolean,
    },
    connect:{
        type:Boolean,
       
    },
    date:{
        type:Date,
        default:Date.now
    }

});
var User= mongoose.model('user',userSchema);
module.exports=User;