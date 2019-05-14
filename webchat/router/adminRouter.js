var express= require('express');

const auth = require('../config/authuser');
const authadmin = require('../config/authadmin');
var router = express.Router();
const User= require('../model/user');
var _ = require('lodash');


/*
router.post('/depts/:dept',authadmin,async (req,res)=>{
    const dept = new Dept({
       name:req.params.dept
    });
   dept.save().then(()=>{
       res.send('successfully updated');                                        // dept schema required to add departments
   }).catch((err)=>{                                                               // (/api/admin/depts/:dept)
       console.log(err);                                                         //post method ,, name:dept.name
   });
});
router.get('/depts/all',authadmin, async (req,res)=>{
    User.find({})
    .then((user)=>{                                                                // display all the user (/api/admin//users/all)
        res.json(_.pick(user,[name]));
    }).catch((err)=>{
        console.log(err);
    })
})

   router.delete('/depts/:dept',authadmin,async (req,res)=>{                          // delete the departments from the list
    Dept.findOneAndDelete({name:req.params.dept})                               // (/api/admin/:dept)
    .then((user)=>{                                                             // delete method
        console.log('successfully deleted');
    }).catch((err)=>{console.log(err);});


})
*/

router.delete('/delete',async (req,res)=>{
    console.log(req.body[0].username);
    User.findOneAndDelete({username:req.body[0].username})
    .then((user)=>{                                                               //view all the users and delete the required
        console.log('successfully deleted');
        res.json('deleted');
    }).catch((err)=>{console.log(err);});                                         //delete user using their id 
});



router.get('/all',authadmin,async (req,res)=>{
    User.find({isadmin:false},'username name dept connect -_id')
    .then((user)=>{                                                                // display all the user (/api/admin//users/all)
        res.send(user);                        
    }).catch((err)=>{
        console.log(err);
    })
});
module.exports=router;