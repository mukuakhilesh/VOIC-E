CUSTOM-DEFINED-MESSAGES

"message"=

1.   = 'got user media'

Parent : gotStream()
line : 111

2.    = 'bye'

Parent : window.onbeforeunload
line : 144

3. =   {
    type: 'candidate',
    label: event.candidate.sdpMLineIndex,
    id: event.candidate.sdpMid,
    candidate: event.candidate.candidate
  }

Parent : handleIceCandidate
line : 166

4.  =  sessionDescription
/* 
//used in doCall() and doAnswer()

doCall has message:type ==='offer'
doCall initiates pc.createOffer()
&
doAnswer has message.type ==='answer'
doAnswer() initiates pc.createAnswer()
*/

Parent : setLocalAndSendMessage
line : 194

5.    =   'bye'

PArent: hangup
line : 246
