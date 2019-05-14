'use strict';

var isChannelReady = false;
var isInitiator = false;
var isStarted = false;
var localStream;
var pc;
var remoteStream;
var turnReady;
var receivedStream = false;

var pcConfig = {'iceServers' : [{'urls':'stun:stun.l.google.com:19302'}] };

//Set up audio and video regardless of devices

var sdpConstraints = {
    offerToReceiveAudio : true,
    offerToReceiveVideo : true
};

/////////////////////////////////////////////

var room = prompt("Enter room name to join:");
var userName = prompt("Enter your name");
document.getElementById('user_name').textContent = userName;
// Could prompt for room name:
// room = prompt('Enter room name:');

var socket = io.connect();

if (room !== '') {
  socket.emit('join', room,userName);
  console.log('Attempting to join room', room);
}
else {
  alert("Enter valids room name");
  room = prompt("Enter room name to create:");
}

////  SOCKET COMMANDS CLIENT SIDE

socket.on('joined', function(room , akhiReturnedSocketid){
    console.log(userName + ' joined the room ' + room);
    console.log(' socket id returned by me ' + akhiReturnedSocketid);
    console.log('===================================================');
    //console.log("default socket.id = ");
    isChannelReady = true;

});

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

    if(message.type === 'offer') {
        handleOfferEvent(message);

    } else if(message.type === 'answer' && !receivedStream){
        handleAnswer(message);

    }else if (message.type === 'candidate') {
        var candidate = new RTCIceCandidate({
            sdpMLineIndex: message.label,
            candidate: message.candidate
        });
        pc.addIceCandidate(candidate);

    } 
});

//////////////////////////////////////////////////////HANDLE OFFER EVENT/////////////////////////

function handleOfferEvent(message){
    createPeerConnection();
    pc.setRemoteDescription(new RTCSessionDescription(message));
    doAnswer();
}
////////////////////////////////////////////////////////////////////

function handleAnswer(message){
    pc.setRemoteDescription(new RTCSessionDescription(message));
}

/////////////////SOCKET message command overs here
var remoteVideo = document.querySelector('#remoteVideo');


if(location.hostname!== 'localhost'){
    requestTurn('https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913');
}
/////////////////////////////////////maybeStart() function///////////////////////

/*
window.onbeforeunload = function() {
    sendMessage('bye');
  };
*/

///////////////////////////////////////////////PEER CONNECTION COMMANDS/////////////

function createPeerConnection(){
    try{

        pc = new RTCPeerConnection(null);
        pc.onicecandidate = handleIceCandidate;
        //console.log("HANDLE ICE CANDIDATE KE BAAD");
        pc.onaddstream = handleRemoteStreamAdded;
        //console.log("HANDLEndleRemoteStreamAdded;")z
        pc.onremovestream = handleRemoteStreamRemoved;
        //console.log("Created Peer Connection");

    } catch(err){

        console.log('Failed to create RTCPeerConnection, exception: '+err);
        alert('Cannot create RTCPeerConnection object');
        alert("Reload page");
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

/*
function doOffer(){
    console.log(userName = ': sending offer to peer ');
    pc.createOffer(setLocalAndSendMessage,handleCreateOfferError);
}
*/

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
    console.log('Remote stream removed : ' + Event);
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
