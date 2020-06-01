# webrtc-chat-helper
It is a library, which has basic and simple interface to implement werbrtc connection between multiple sockets

NOTE: if you don't want to follow the steps. below is the readymade example
https://github.com/miralbhalani/webrtc-multiscreen-chat-demo
just clone it and write
npm install &&
npm start


# How to use

```
// chatInstance is instance where you will interact with all it's methods
const chatInstance = new Chat();

// Connect chat insatance to your server port or domain
chatInstance.connect("localhost:5000");

// Tell chatInstance to use your camera to show your video stream
// in your local video element.
// This same stream will be used when you call to some socket/user 
// as input call stream
chatInstance.usMyCameraStream((stream) => {
  const localVideo = document.getElementById('local-video');
  if (localVideo) {
    localVideo.srcObject = stream;
  }
});

// this is a listner which will ask you to update your user list
// that you are showing in your html
// users is a list of array of online sockets
chatInstance.watchOnSocketIds((users) => {
  updateUserList(users);
});

// when you get incomming call from someone 
// it automatically will start giving you the incoming strem in 
// below listener. And you can set that stream to your remote video element
// NOTE: it gives socketId with stream which sayas, whose stream it is so
// you can set that stream to perticular vido element, because you would have
// multiple video elements at a time
chatInstance.streamOfIncomingCall((stream, socketId) => {
  const remoteVideo = document.getElementById(PeerConnection.getVideoElementID(socketId));
  if (remoteVideo) {
    remoteVideo.srcObject = stream;
  }
});

// when you call to someone, below listner will automatically start giving
// the stream of socket to whome you called
// NOTE: it gives socketId with stream, which tells you to whome you called
// so whose video element you have to fill with incoming stream
chatInstance.streamOfOutgoingCall((stream, socketId) => {
  const remoteVideo = document.getElementById(PeerConnection.getVideoElementID(socketId));
  if (remoteVideo) {
    remoteVideo.srcObject = stream;
  }
});

// When you want to call someone, you just have to call below function,
// chatInstance.callToSocket(socketId);
// it will automatically start your chat, the reciever will
// automatically recieve the call and start showing the video from 
// startOfIncomingCall of the reciever
// And, will automatically start showing the recievers video,
// to your video element by using streamOfOutgoingCall of sender
async function callUser(socketId) {
  await chatInstance.callToSocket(socketId);
}
```

# Steps

1. Clone this project
2. go to public/browser folder of this project
3. copy the browser folder to your public folder 
```
This browser folder has javascripts that you can load to your browser
if you are not refering to public folder, then just imagine that, this
folder should be at open place where files can be loaded in browser 
ex : localhost:5000/browser/Chat.js, localhost:5000/browser/PeerConnection.js
```
4. add following to your package.json in dependancies section
```
"webrtc-chat-helper": "git://github.com/miralbhalani/webrtc-chat-helper.git#master"
```
5. npm install
6. If you are using express then you can do following
```
import { ServerIO } from 'webrtc-chat-helper';

this.app = express();
this.httpServer = createServer(this.app);

// Just attach your httpserver to the instance of ServerIO
(new ServerIO(this.httpServer));

```
7. In your index.html
```
ADD SOCKET IO 
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.3.0/socket.io.dev.js"></script>
ADD require js because I haved exported typescript in amd format
<script data-main="/browser/Chat.js" type="text/javascript" 
            src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.5/require.js"></script>
            
<script>
  // Setting up basic folder to look over
  requirejs.config({
    baseUrl: 'browser'
  });

  // requiring the dependancies
  require(['Chat', 'PeerConection'], function (_module) {
    // var g = new module.Chat()

    Main(_module);
  });

  function Main(_dependancies) {

  const { Chat, PeerConnection } = _dependancies;

  // chatInstance is instance where you will interact with all it's methods
  const chatInstance = new Chat();

  // Connect chat insatance to your server port or domain
  chatInstance.connect("localhost:5000");

  // Tell chatInstance to use your camera to show your video stream
  // in your local video element.
  // This same stream will be used when you call to some socket/user 
  // as input call stream
  chatInstance.usMyCameraStream((stream) => {
    const localVideo = document.getElementById('local-video');
    if (localVideo) {
      localVideo.srcObject = stream;
    }
  });

  // this is a listner which will ask you to update your user list
  // that you are showing in your html
  // users is a list of array of online sockets
  chatInstance.watchOnSocketIds((users) => {
    updateUserList(users);
  });

  // when you get incomming call from someone 
  // it automatically will start giving you the incoming strem in 
  // below listener. And you can set that stream to your remote video element
  // NOTE: it gives socketId with stream which sayas, whose stream it is so
  // you can set that stream to perticular vido element, because you would have
  // multiple video elements at a time
  chatInstance.streamOfIncomingCall((stream, socketId) => {
    const remoteVideo = document.getElementById(PeerConnection.getVideoElementID(socketId));
    if (remoteVideo) {
      remoteVideo.srcObject = stream;
    }
  });

  // when you call to someone, below listner will automatically start giving
  // the stream of socket to whome you called
  // NOTE: it gives socketId with stream, which tells you to whome you called
  // so whose video element you have to fill with incoming stream
  chatInstance.streamOfOutgoingCall((stream, socketId) => {
    const remoteVideo = document.getElementById(PeerConnection.getVideoElementID(socketId));
    if (remoteVideo) {
      remoteVideo.srcObject = stream;
    }
  });

  // When you want to call someone, you just have to call below function,
  // chatInstance.callToSocket(socketId);
  // it will automatically start your chat, the reciever will
  // automatically recieve the call and start showing the video from 
  // startOfIncomingCall of the reciever
  // And, will automatically start showing the recievers video,
  // to your video element by using streamOfOutgoingCall of sender
  async function callUser(socketId) {
    await chatInstance.callToSocket(socketId);
  }


</script>
```
