var fs =require('fs');
//var http = require('http');
//var https = require('https');
//var privateKey  = fs.readFileSync('./cert/self.key', 'utf8');
//var certificate = fs.readFileSync('./cert/self.crt', 'utf8');
//var credentials = {key: privateKey, cert: certificate};
const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');
const path =require('path');
const ip = require('ip');
var bodyparser = require('body-parser');
const app = express();

//routes
var loginRouter= require('./router/loginRouter');
var registerRouter= require('./router/registerRouter');
var detailRouter = require('./router/detailsRouter');
var adminRouter = require('./router/adminRouter');
var updateRouter = require('./router/updateRouter');
var emailRouter = require('./router/emailRouter');


// middleware
app.use(cors());
app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.json);

//custom middleware

app.use('/api/login',loginRouter);
app.use('/api/register',registerRouter);
app.use('/api/me',detailRouter);
app.use('/api/admin',adminRouter);
app.use('/api/update',updateRouter);
app.use('/api/email',emailRouter);
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/public/first.html'));
});
mongoose.connect('mongodb://127.0.0.1/new',{ useNewUrlParser: true})
.then(()=>{
    console.log("database connected");
}).catch((err)=>{
    console.log(err)
});
console.log('ashish');
const port = process.env.PORT||8081;
const port1 = 8080;
//var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);

//httpServer.listen(port);
//httpsServer.listen(port1);
app.listen(port,'192.168.43.188',()=>{
    console.log(`listening on port ${port} and ip is`+ip.address());

}); 