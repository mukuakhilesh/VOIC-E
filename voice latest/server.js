const path = require('path');
const fs = require('fs'); 
const express = require('express');
const app = new express();
var cors = require('cors');
const http = require("http").Server(app);
var io = require("socket.io")(http);
const SocketIOFile = require('socket.io-file');
var obj;
var adminSocketId = null;

var port = process.env.port || 3000;
app.use(cors());
app.use(express.static(__dirname));

app.get('/client',(req,res)=>{
  res.sendFile(__dirname+'/client.html');
})

app.get('/admin',(req,res)=>{
  res.sendFile(__dirname+'/admin.html'+ req.query.name);
})

app.get('/query',(req,res)=>{
  var find= req.query;
  search(find.search,res);
  console.log(obj);
  //res.send(obj);
});

app.get('/file',(req,res)=>{
  var _file = req.query;
  console.log(_file);
  fs.readFile('./archive/'+_file.path, 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
      res.send(data);
      }

})
  });
  app.get('/filelist',(req,res)=>{
    fs.readdir('./archive', (err, files) => {
      var arr =[];
      
      files.forEach(file => {
          var temp ={name:file};
        arr.push(temp);
         
         
      }) 
      
    var json={arr};
console.log(json);
var as=JSON.stringify(json);
      res.send(as);
  })
});

app.get('/socket.io-file-client.js', (req, res, next) => {
	return res.sendFile(__dirname + '/node_modules/socket.io-file-client/socket.io-file-client.js');
});

io.sockets.on('connection', function(socket){
    
// convenience function to log server messages on the client

function log() {
    var array = ['Message from server:'];
    array.push.apply(array, arguments);
    socket.emit('log', array);
}

  ///check no. of clients in room

function getNumClients(room){

  var clientsInRoom = io.sockets.adapter.rooms[room];
  var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;

  return numClients;
}


  socket.on('query' , function(msg , room){
    socket.broadcast.emit('query' ,{
      user : socket.nickname,
      message : msg
    });
    date=new Date();
    filepath=date.toISOString();
    
    var fpath=filepath.substring(0,10);
    console.log(fpath);
    append('./archive/'+fpath+'.json',{name:socket.nickname,text : msg,date:date});
  });
/*
    logToFile({
                  user: socket.nickname,
                  message: msg
                })
});
*/

  socket.on('message', function(message) {
    log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

    socket.on('msgForAdmin' , function(message){
      console.log('got a msg foR ADMIN');
      console.log("admin id" , adminSocketId);
      io.to(adminSocketId).emit('msgForAdmin' , message);
      console.log("directed msg to admin")
    })
///////////////room  creation request from admin

  socket.on('create',function(room , username) {

    socket.join(room);
  //  console.log('username '+ username);
    socket.nickname = username;
  //console.log("JOINED USER nickname = " + socket.nickname );
    adminSocketId = socket.id;
    log('Client ID ' + socket.id + ' created room ' + room);
    console.log("created room " + room);
    socket.emit('created', room, socket.id);
    //console.log("sent 'created' message ")
    socket.broadcast.emit('adminSocketId',adminSocketId);

  });

///////////////////////msg for joining with room and name by clients 
  socket.on('join', function(room , userName) {
    log(userName + ' sent request to join room ' + room);
    var numClients = getNumClients(room);
    log('Room ' + room + ' presently has ' + numClients + ' client(s)');

    /////////////////////////////check room size/////////////////////
    if (numClients <=50 ) {
      log(userName + ' with Client ID ' + socket.id + ' wants to join ' + room);
     // io.sockets.in(room).emit('join ', room);
      socket.join(room);
      socket.nickname = userName;
      socket.emit('joined', room, socket.id , adminSocketId);
      socket.broadcast.emit('newClient' , userName);               //for showing online users
      io.sockets.in(room).emit('ready',room);
    } else {
      socket.in(room).emit('full', room);
    }
  });

    socket.on('msgForServer' , (msg) => {
    console.log('got from client : ' , msg);
    console.log('socket id',socket.id);
});

  ///////////////////////////join fuction ends//////////////

  socket.on('ipaddr', function() {
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

  socket.on('bye', function(){
    console.log('received bye');
    socket.broadcast.emit('clientOffline' , socket.nickname);
  });

  socket.on('iAmLeaving' , function(){
    socket.broadcast.emit('clientOffline' , socket.nickname);
    console.log(socket.nickname + ' left ============');
  });



          ///////////////file upload

        var count = 0;
        
	var uploader = new SocketIOFile(socket, {
		// uploadDir: {			// multiple directories
		// 	music: 'data/music',
		// 	document: 'data/document'
		// },
		uploadDir: 'data',							// simple directory
	
		chunkSize: 10240,							
		transmissionDelay: 0,						// delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
		overwrite: false, 							

	});
	uploader.on('start', (fileInfo) => {
		console.log('Start uploading');
		console.log(fileInfo);
	});
	uploader.on('stream', (fileInfo) => {
		console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
	});
	uploader.on('complete', (fileInfo) => {
		console.log('Upload Complete.');
                console.log(fileInfo);
                link = "http://localhost:3000/"+fileInfo.uploadDir;
                //socket.broadcast.emit('fileLink',link);
                socket.broadcast.emit('fileInfo' ,{
                  user : socket.nickname,
                  name : fileInfo.name,
                  fileLink : link
                });

                
                console.log(fileInfo.uploadDir);
	});
	uploader.on('error', (err) => {
		console.log('Error!', err);
	});
	uploader.on('abort', (fileInfo) => {
		console.log('Aborted: ', fileInfo);
	});
////////////////////////////////////////////////////////////////////////
});
////////////////////////////////query///////////////////////////////////////
function append(filepath,query){
  fs.readFile(filepath, 'utf8', function readFileCallback(err, data){
     if (err){
         console.log(err);
         json = JSON.stringify({table:[query]}); //convert it back to json
         fs.writeFile(filepath, json, 'utf8', (err)=>{
             console.log(err);
         }); // write it back 
     } else {
     obj = JSON.parse(data); //now it an object
     obj.table.push(query); //add some data
     json = JSON.stringify(obj); //convert it back to json
     fs.writeFile(filepath, json, 'utf8', (err)=>{
         console.log(err);
     }); // write it back 
 }});
}
function search(search,res){
   
    fs.readdir('./archive', (err, files) => {
        files.forEach(file => {
            var arr={
                found:[],
            };
          console.log(file);
          fs.readFile('./archive/'+file, 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
               
            obj = JSON.parse(data); //now it an object
           // obj.table.push({id: 2, square:3}); //add some data
           //
            for(var i in obj.table){
                if(obj.table[i].text.includes(search)){
                console.log(obj.table[i]);
                var temp=obj.table[i];
                temp["filename"]=file;
                     arr.found.push(temp);
                  
                }
                }
            }
    
            json = JSON.stringify(arr); //convert it back to json
            fs.writeFile('./search.json', json, 'utf8', (err)=>{
                console.log(err);
            }); // write it back 
            res.send(json);
            
        })
        });
      });
  
};


http.listen(port,function(){
    console.log("listening to port" + port);
});



