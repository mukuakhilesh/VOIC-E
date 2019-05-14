const jwt = require('jsonwebtoken');
function auth(req,res,next){
    console.log('1');
    const token = req.header('x-auth-token');
    console.log('token'+token);
    if(!token) return res.status(401).send("unautharsied access");
     try{
     const decode = jwt.verify(token,'privatekey');
     req.user=decode;
     console.log(' yyayytoken :',res.user);
     }
     catch(err){
       return res.status(401).send('invalid token');
       
     }
    next();
}
module.exports=auth;