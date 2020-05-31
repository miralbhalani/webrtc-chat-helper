
const { RTCPeerConnection, RTCSessionDescription } = window;

export class PeerConnection {


  static stream: any;
  static socketToPeerConnectionMapper: any = {};

  static setStream(_stream: any) {
    this.stream = _stream;
  }

  static addSocketToPeerConnectionMapper(socket: any, peerConnection: any) {
    this.socketToPeerConnectionMapper[socket] = peerConnection;
  }

  static getPeerConnection(socket: any, iceCandidateListenCb: Function) {
    let peerConnection;
    if(this.socketToPeerConnectionMapper[socket]) {
      peerConnection = PeerConnection.socketToPeerConnectionMapper[socket];
    } else {
      peerConnection = new PeerConnection(socket);
      PeerConnection.addSocketToPeerConnectionMapper(socket, peerConnection);

      peerConnection.listenIceCandidate(iceCandidateListenCb)
    }
    return peerConnection;
  }

  static getVideoElementID(socketId: string) {
    return "remote-video-"+socketId
  }


  peerConnection: any
  socketId: string
  constructor(_socketId: string) {
    this.peerConnection = new RTCPeerConnection();
    this.socketId = _socketId;

    let _self = this;

    PeerConnection.stream.getTracks().forEach((track: any) => {
      this.peerConnection.addTrack(track, PeerConnection.stream)
    });

    
  }

  onRemoteTrack(_onRemoteTrakCB) {
    let _self = this;
    this.peerConnection.ontrack = function({ streams: [stream] }: any) {
      _onRemoteTrakCB(stream);
      // const remoteVideo: any = document.getElementById(PeerConnection.getVideoElementID(_self.socketId));
      // if (remoteVideo) {
      //   remoteVideo.srcObject = stream;
      // }
    };
  }


  listenIceCandidate(iceCandidateListenCb: Function) {
    var _self = this;
    this.peerConnection.addEventListener('icecandidate', function handleConnectionLocal(event: any) {
      // const peerConnection = event.target;
      console.log('listenICECANDIDATE > ', event)
      console.log('listenICECANDIDATE > 1', event.candidate, _self.socketId)
      const iceCandidate = event.candidate;
      iceCandidateListenCb(iceCandidate, _self.socketId);
    });
  }

  async addIceCandidate(iceCandidate: any) {
    console.log("icecandidate --- -- ", iceCandidate)
    if(iceCandidate) {
      const newIceCandidate = new RTCIceCandidate(iceCandidate);
      return this.peerConnection.addIceCandidate(newIceCandidate)
    }
  }

  async createOfferAndSetDescription() {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    return offer;
  }

  async setDescriptionAndGetAnswer(offer: any) {
    await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(new RTCSessionDescription(answer));
  
    return answer;
  }

  async setRemoteDescription(answer: any) {
    return await this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    )
  }
  

}