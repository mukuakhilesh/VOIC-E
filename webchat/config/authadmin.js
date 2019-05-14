const jwt = require('jsonwebtoken');
function auth(req,res,next){
    const token = req.header('x-auth-token');
    console.log('authadmin'+token);
    if(!token) {
      console.log('failed');
      return res.status(401).send("unautharsied access");
    }
      try{
     const decode = jwt.verify(token,'privatekey');
     req.user=decode;
     console.log(req.user.admin);
     if(!req.user.admin) return (res.status(401).send("unautharsied access"));
     console.log('token :',res.user);
     
     }
     catch(err){
       return res.status(401).send('invalid token');
       
     }
     next();
}
module.exports=auth;