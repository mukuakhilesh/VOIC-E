'use strict';

var isChannelReady = false;
var isInitiator = false;
var isStarted = false;
var localStream;
var pc;
var remoteStream;
var turnReady;
var receivedStream = false;
var mySocketId;
var adminSocketId = null;
var userName=null;
var pcConfig = {'iceServers' : [{'urls':'stun:stun.l.google.com:19302'}] };
////////////////////////////////////////////////////QUERY PART////////////////////////////////////////////////////

var queryBox = document.querySelector("#query_box");
//var queryBtn = document.querySelector('#query_btn');

////////////////////////////////////QUERY BUTTON///////////////////
document.getElementById("query_btn").addEventListener("click", function(event){
    event.preventDefault();
       var query = document.getElementById('queryInput').value;
       console.log(query);
       sendQuery(query);
    });

///////////////////////

function receiveQuery (data)
{   
    $("#query_box").prepend('<div class="queryContainer">' + '<p id="queryNameHead">' + data.user + '</p>'+
                        '<p>'+ data.message +'</p>'+
                        '</div>');
    //event.preventDefault();
}

function sendQuery(msg){
    socket.emit("query" ,msg , room);
    addQuery(msg , mySocketId);
}

function  addQuery(message , socketid){


    $('#query_box').prepend('<div class="queryContainer">'+
                        '<p id="queryNameHead">' + 'Myself :' + '</p>'+
                        '<p>'+message+'</p>'+
                        '</div>');

}
////////////////////////////////////////QUERY PART ENDS/////////////////////////////

//Set up audio and video regardless of devices

var sdpConstraints = {
    offerToReceiveAudio : true,
    offerToReceiveVideo : true
};

/////////////////////////////////////////////
var room = 'voice';
if(!userName){
var url=parseQuery(window.location.search);//////////////////////////////////////////////start
 userName = url.name;
 } ////usename and name///////////////
console.log(userName);
console.log(window.location.search);



function parseQuery(search) {

    var args = search.substring(1).split('&');

    var argsParsed = {};

    var i, arg, kvp, key, value;

    for (i=0; i < args.length; i++) {

        arg = args[i];

        if (-1 === arg.indexOf('=')) {

            argsParsed[decodeURIComponent(arg).trim()] = true;
        }
        else {

            kvp = arg.split('=');

            key = decodeURIComponent(kvp[0]).trim();

            value = decodeURIComponent(kvp[1]).trim();

            argsParsed[key] = value;
        }
    }

    return argsParsed;
}    

var socket = io.connect();

if (room !== '') {
  socket.emit('join', room,userName);
  console.log('Attempting to join room', room);
}

////  SOCKET COMMANDS CLIENT SIDE
socket.on('adminSocketId' ,function(admin){
    adminSocketId = admin;
    console.log("Got Admins Socket Id");
});

socket.on('joined', function(room , returnedSocketid , admin){
    mySocketId = returnedSocketid;
    adminSocketId = admin;
    console.log(userName + ' joined the room ' + room);
    console.log(' socket id returned by me ' + returnedSocketid);
    console.log('===================================================');
    console.log("Got Admins Socket Id = "+ adminSocketId);
    //console.log("default socket.id = ");
    isChannelReady = true;

});

//////////////////////   QUERY COMMAND FROM SOCKET///////////////////////

socket.on('query', function(data)
{
    receiveQuery(data);
});




//////////////file upload
socket.on('fileInfo' , function(data){
    receivedUploadedFile(data);
});

function receivedUploadedFile (data){
    $("#query_box").prepend('<div class="queryContainer">' + '<p id="queryNameHead">' + data.user + '</p>'+
                        '<p>'+'<a href='+'"'+data.fileLink+'"' + '>'+ data.name +'</a>'+'</p>'+
                        '</div>');
    //event.preventDefault();
}



/////////////////////////////////////////////////////////////
socket.on('log' , function(array){
    console.log.apply(console,array);
});


socket.on('full' , function(room){
    alert('Room : '+room + ' is full');
    alert('Reload Page to join other room');
    console.log("Room full");

});

///////////////////////SOCKET MESSAGES END HERE//////////////

function sendMessage(message){
    console.log(userName + ' sending msg : ' , message);
    socket.emit('message', message);
}

/// This Client receives a message from SOCKET SERVER

socket.on('message', function(message){
    console.log(userName + ' received message : ', message);

   
   if(message === 'screenShare'){
       window.location.reload();
   }
   else if(message.type === 'offer') {
        if(!receivedStream) {
            maybeStart(message);
        }
        doAnswer();

    } else if (message.type === 'candidate') {
        var candidate = new RTCIceCandidate({
            sdpMLineIndex: message.label,
            candidate: message.candidate
        });
        pc.addIceCandidate(candidate);

    } else if(message ==='bye' && receivedStream) {
        handleRemoteHangup();

    }
});

function sendMessageToAdmin (message){
    console.log(userName + 'sending msg to Admin :' , message);
    socket.emit('msgForAdmin' , message);
}





/////////////////SOCKET message command overs here
var remoteVideo = document.querySelector('#remoteVideo');


if(location.hostname!== 'localhost'){
    requestTurn('https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913');
}
/////////////////////////////////////maybeStart() function

function maybeStart(msg)  {
    console.log('>>>>>>>>>>>>>>>>>>>>> maybeStart() ');
    console.log("isChannelready = ",isChannelReady);
    if(isChannelReady){

        console.log('>>>>>>>>>>>>>>>>>.Creating peer connection');
        createPeerConnection(msg);
    }
}

window.onbeforeunload = function() {
    sendMessageToAdmin('bye');
  };


///////////////////////////////////////////////PEER CONNECTION COMMANDS

function createPeerConnection(message){
    try{

        pc = new RTCPeerConnection(null);
        pc.setRemoteDescription(new RTCSessionDescription(message))
        //doOffer();
        pc.onicecandidate = handleIceCandidate;
        console.log("HANDLE ICE CANDIDATE KE BAAD");
        pc.onaddstream = handleRemoteStreamAdded;
        console.log("HANDLEndleRemoteStreamAdded;")
        pc.onremovestream = handleRemoteStreamRemoved;
        console.log("Created Peer Connection");

    } catch(err){

        console.log('Failed to create RTCPeerConnection, exception: '+err);
        return;
    }
}

function handleIceCandidate(event) {
    console.log('ice candidate event : ',event);
    if(event.candidate){
        sendMessage({
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
        });
    } else {
        console.log('End Of Candidates');
    }
}


function doOffer(){
    console.log(userName = ': sending offer to peer ');
    pc.createOffer(setLocalAndSendMessage,handleCreateOfferError);
}

function handleCreateOfferError(event){
    console.trace('createoffer() error : ',event);
}

function doAnswer() {
    console.log(userName + ': Sending answer to peer.');
    pc.createAnswer().then(setLocalAndSendMessage, onCreateSessionDescriptionError);

}

function setLocalAndSendMessage(sessionDescription){
    pc.setLocalDescription(sessionDescription);
    console.log('setLocalAndSendMessage...sending sessionDiscription' , sessionDescription);
    sendMessage(sessionDescription);
}

function onCreateSessionDescriptionError(error){
    console.trace('FAiled to create session description :' , error);
}


////////////////////////for turn servers request//////////////////////
function requestTurn(turnURL) {
    var turnExists = false;
    for (var i in pcConfig.iceServers) {
      if (pcConfig.iceServers[i].urls.substr(0, 5) === 'turn:') {
        turnExists = true;
        turnReady = true;
        break;
      }
    }
    if (!turnExists) {
      console.log('Getting TURN server from ', turnURL);
      // No TURN server. Get one from computeengineondemand.appspot.com:
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var turnServer = JSON.parse(xhr.responseText);
          console.log('Got TURN server: ', turnServer);
          pcConfig.iceServers.push({
            'urls': 'turn:' + turnServer.username + '@' + turnServer.turn,
            'credential': turnServer.password
          });
          turnReady = true;
        }
      };
      xhr.open('GET', turnURL, true);
      xhr.send();
    }
  }
  ///////////////////////////////////////turn event ends////////////////

function handleRemoteStreamAdded(event) {
    console.log(userName + ': Remote Stream Added');
    remoteStream = event.stream;
    remoteVideo.srcObject = remoteStream;
    receivedStream = true;
}

function handleRemoteStreamRemoved(event) {
    console.log('Remote stream removed : ' + event);
    receivedStream = false;
}

function handleRemoteHangup(){
    console.log('Session Terminated.');
    stop();
}

function stop(){
    isStarted = false;
    pc.close();
    pc = null;
}
