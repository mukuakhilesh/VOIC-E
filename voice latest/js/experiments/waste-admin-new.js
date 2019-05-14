'use strict';

var isChannelReady = false;
var isInitiator = false;
var isStarted = false;
var localStream;
var pc;
var turnReady;
var pc1;
var state;
var pcConfig = { 'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}] };

// Set up audio and video regardless of what devices are present.
var sdpConstraints = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  };
  
  //////////////////////// TAKING USERNAME AND ROOMNAME

  

var room = prompt("Enter room name to create:");
var userName = "MD "+ prompt("Enter your name");

///////////////////SOCKET MESSAGES////////////////
var socket = io.connect();

if (room  !=='') {
    socket.emit('create',room);
    console.log(userName + ": Sent request to create room");
}
else {
    alert("Enter valids room name");
    room = prompt("Enter room name to create:");
}

socket.on('created', function(room , socketid){
    console.log('Created Room '+ room);
    console.log('My socket id =====' + socketid);
    isInitiator = true;
});

socket.on('full',function(room){
    console.log(room +  " is full ");
});

socket.on('ready',function(room){
    console.log('Triggering Channel In ' + room);
    isChannelReady =  true;
    if(isInitiator){
        invite();
        negotiate();
    }
});

socket.on('log',function(array){
    console.log.apply(console , array);
});

//////////////////////////////////////////////////////////


function sendMessage(message) {
    console.log(userName + ' sending msg : ',message);
    socket.emit('message' , message)
}

socket.on('message' , function(message) {

    console.log(userName + ' received msg : ', message)

    if(message.type === 'answer'){
        handleAnswer(message);

    }else if(message.type === 'offer') {
        handleOfferEvent(message);

    }else if (message.type === 'candidate' && isStarted) {
        var candidate = new RTCIceCandidate({
            sdpMLineIndex: message.label,
            candidate: message.candidate
        });
        pc.addIceCandidate(candidate);
    }

});
////////////////////////////////////////////////////////////////

function invite() {

    createPeerConnection();
    getLocalMedia();
    };



//////////////////////////////////////////

function negotiate(){
    console.log("Negotiation events");
    console.log("iceGatheringState ======= = "+ state);
    doOffer();
   // sendMessaage('ready to send media');
}
/////////////////////////////////////////////////////////

function handleOfferEvent(message){
    createPeerConnection();
    pc.setRemoteDescription(new RTCSessionDescription(message));
    console.log("hnadleOfferEvent : iceGatheringState ======= = "+ state);
    doAnswer();
}

//////////////////////////////////////////////////////

function handleAnswer(message){
    console.log("GOT the ANSWER");
    pc.setRemoteDescription(new RTCSessionDescription(message));
    console.log("setting remotrdescription....  " +pc.remoteDescription );
    console.log("handleAnswerEvent : iceGatheringState ======= = "+ state);
}

////////////////////////////////////////VIDEO WORKS/////////////
var localVideo = document.querySelector('#localVideo');

var constraints = {
    audio : false,
    video : true
};

function getLocalMedia(){
navigator.mediaDevices.getUserMedia(constraints).then(gotStream)
.catch(function(err){
    alert('getUserMedia error : '+ err.name );
});

function gotStream(stream){

    console.log(userName + ' : Adding local stream.');
    localStream =  stream;
    localVideo.srcObject = stream;
    sendMessage('got user media');
    pc.addStream(localStream);
    isStarted = true;
    console.log(">>>>>>>>>>>> iceGatheringState = " + state);

    console.log("Process of getting local media executed successfully");
    
    //if(isInitiator){
      //  maybeStart();
    //}
}
}
/////////////////////SEND REQUEST FOR TURN SERVER///////////////
if(location.hostname !== 'localhost') {

    requestTurn(
        'https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913'
    );
}

/////////////////////////////////////////////////////////////////////


window.onbeforeunload = function(){
    sendMessage('bye');
};

//////////////////////////////PEER COONECTIONS FUNCTIONS///////////

/*
var createPeerConnection = new Promise((resolve,reject)=>{
    try{
        pc = new RTCPeerConnection(null);
        pc.onicecandidate = handleIceCandidate;
        console.log('Created RTCPeer Connection');
        resolve('created');
    }
    catch(err){
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        alert('cannot create');
        reject('Cannot create RTCPeerConnection object.');
    }
});
*/
function createPeerConnection() {
    try{
        pc = new RTCPeerConnection(null);

        state = pc.iceGatheringState;

        console.log(">>>>>>>>>>>> iceGatheringState = " + state);
        pc.onicecandidate = handleIceCandidate;
        console.log('Created RTCPeer Connection');
        console.log(">>>>>>>>>>>> iceGatheringState = " + state);
    }
    catch(err){
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        alert('Cannot create RTCPeerConnection object.');
        return;
    }
}
function handleIceCandidate(event){
    console.log(">>>>>>>>>>>> handleIceCandidate : iceGatheringState = " + state);
    console.log('icecandidate event : ' , event);
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

function handleCreateOfferError(event){
    console.log('createOffer() error :' , event);
}

function doOffer() {
    console.log(userName + ' sending offer to peer.');
    pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
    //pc.createAnswer().then( setLocalAndSendMessage, onCreateSessionDescriptionError);
}

function doAnswer() {
    console.log(userName + ': Sending answer to peer.');
    pc.createAnswer().then(setLocalAndSendMessage, onCreateSessionDescriptionError);

}

function setLocalAndSendMessage(sessionDescription){
    pc.setLocalDescription(sessionDescription);
    console.log('setLocalAndSendMessage sending message', sessionDescription);
    sendMessage(sessionDescription);
}

function onCreateSessionDescriptionError(error) {
    console.trace('Failed to create session description: ' + error.toString());
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

  function hangup() {
    console.log('Hanging up.');
    stop();
    sendMessage('bye');
  }
/*
  function handleRemoteHangup() {
    console.log('Session terminated.');
    stop();
    isInitiator = false;
  }
  */
  
  function stop() {
    isStarted = false;
    pc.close();
    pc = null;
  }
  