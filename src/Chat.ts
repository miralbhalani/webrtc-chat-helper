
// import io from "./external-files/socket.io.js";
import { PeerConnection } from "./PeerConection";
export { PeerConnection } from "./PeerConection";
// const { RTCPeerConnection, RTCSessionDescription } = window;

export class Chat {

    mySocketId: string;
    onStreamOfIncomingCallCb: Function;
    onStreamOfOutgoingCallCb: Function;
    static getLocalStream() {
        return PeerConnection.stream;
    }

    socket: any;
    connect(connectionString: string) {
        // "localhost:5000"
        this.socket = io.connect(connectionString);
        this.attachBasicIosToSocket();
    }

    watchOnSocketIds(socketIdsChangeCB: Function) {
        this.socket.on("update-user-list", ({ users }: any) => {
            users = users.filter((_user) => {
                return _user != this.mySocketId
            })
            socketIdsChangeCB(users);
        });
    }

    private attachBasicIosToSocket() {
        this.socket.on("add-icecandidate", async (data: any) => {
            let peerConnectionM = PeerConnection.getPeerConnection(data.socket, this.iceCandidateListenCb);
            peerConnectionM.addIceCandidate(data.iceCandidate);
        });

        this.socket.on("my-socket-id", async (mySocketId: any) => {
            this.mySocketId = mySocketId
        });

        this.socket.on("call-made", async (data: any) => {
            let peerConnectionM = PeerConnection.getPeerConnection(data.socket, this.iceCandidateListenCb);
            console.log('onRemoteTrack added to', data.socket);
            peerConnectionM.onRemoteTrack((stream) => {
                console.log(';;;;;;;;;;;;;;;;; > ', stream, data.socket)
                this.onStreamOfIncomingCallCb(stream, data.socket)
            });
            
            
            const answer = await peerConnectionM.setDescriptionAndGetAnswer(data.offer);
            console.log('call-made offer TO', data.offer);
            console.log('call-made answer TO', answer)
            
            
            this.socket.emit("make-answer", {
                answer,
                to: data.socket
            });

            
        });

        this.socket.on("answer-made", async (data: any) => {
            let peerConnectionM = PeerConnection.getPeerConnection(data.socket, this.iceCandidateListenCb);
            console.log('answer-made from >', data.answer)
            await peerConnectionM.setRemoteDescription(data.answer);
        });

    }

    usMyCameraStream(_useMyCameraStreamCB) {
        navigator.getUserMedia(
            { video: true, audio: true },
            stream => {
                PeerConnection.setStream(stream);
                _useMyCameraStreamCB(stream)
            },
            error => {
                console.warn(error.message);
            }
        );
    }

    useThisStream(_stream: any) {
        PeerConnection.setStream(_stream);
    }

    private iceCandidateListenCb = (iceCandidate: any, socketId: string) => {

        this.socket.emit("call-add-icecandidate", {
            iceCandidate,
            to: socketId
        });
    }

    async callToSocket(socketId: any) {

        let peerConnectionM = PeerConnection.getPeerConnection(socketId, this.iceCandidateListenCb);
        peerConnectionM.onRemoteTrack((stream) => {
            this.onStreamOfOutgoingCallCb(stream, socketId)
        });
        
        const offer = await peerConnectionM.createOfferAndSetDescription();
        this.socket.emit("call-user", {
            offer,
            to: socketId
        });

        
        // const remoteVideo = document.getElementById(PeerConnection.getVideoElementID(socketId));
        // if (remoteVideo) {
        //     remoteVideo.srcObject = stream;
        // }
        return peerConnectionM;
    }

    
    streamOfIncomingCall(_onStreamOfIncomingCallCb) {
        this.onStreamOfIncomingCallCb = _onStreamOfIncomingCallCb;
    }

    streamOfOutgoingCall(_onStreamOfOutgoingCallCb) {
        this.onStreamOfOutgoingCallCb = _onStreamOfOutgoingCallCb;
    }


}