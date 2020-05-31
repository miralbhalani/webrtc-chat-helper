
// import io from "./external-files/socket.io.js";
import { PeerConnection } from "./PeerConection";
export { PeerConnection } from "./PeerConection";
// const { RTCPeerConnection, RTCSessionDescription } = window;

export class Chat {

    mySocketId: string;
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
            console.log('update-user-list > my socketId on userlist', this.mySocketId);
            console.log('update-user-list > users', users)
            users = users.filter((_user) => {
                return _user != this.mySocketId
            })
            console.log('update-user-list > users after', users)
            socketIdsChangeCB(users);
        });
    }

    private attachBasicIosToSocket() {
        this.socket.on("add-icecandidate", async (data: any) => {
            let peerConnectionM = PeerConnection.getPeerConnection(data.socket, this.iceCandidateListenCb);
            console.log('add-icecandidate socket on > ',data)
            peerConnectionM.addIceCandidate(data.iceCandidate);
        });

        this.socket.on("my-socket-id", async (mySocketId: any) => {
            console.log('mySocketId', mySocketId)
            this.mySocketId = mySocketId
        });

        this.socket.on("call-made", async (data: any) => {
            let peerConnectionM = PeerConnection.getPeerConnection(data.socket, this.iceCandidateListenCb);
            const answer = await peerConnectionM.setDescriptionAndGetAnswer(data.offer);
            this.socket.emit("make-answer", {
                answer,
                to: data.socket
            });
        });

        this.socket.on("answer-made", async (data: any) => {
            let peerConnectionM = PeerConnection.getPeerConnection(data.socket, this.iceCandidateListenCb);
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
        const offer = await peerConnectionM.createOfferAndSetDescription();
        this.socket.emit("call-user", {
            offer,
            to: socketId
        });
        return peerConnectionM;
    }


}