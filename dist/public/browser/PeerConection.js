var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PeerConnection = void 0;
    var RTCPeerConnection = window.RTCPeerConnection, RTCSessionDescription = window.RTCSessionDescription;
    var PeerConnection = /** @class */ (function () {
        function PeerConnection(_socketId) {
            var _this = this;
            this.peerConnection = new RTCPeerConnection();
            this.socketId = _socketId;
            var _self = this;
            PeerConnection.stream.getTracks().forEach(function (track) {
                _this.peerConnection.addTrack(track, PeerConnection.stream);
            });
        }
        PeerConnection.setStream = function (_stream) {
            this.stream = _stream;
        };
        PeerConnection.addSocketToPeerConnectionMapper = function (socket, peerConnection) {
            this.socketToPeerConnectionMapper[socket] = peerConnection;
        };
        PeerConnection.getPeerConnection = function (socket, iceCandidateListenCb) {
            var peerConnection;
            if (this.socketToPeerConnectionMapper[socket]) {
                peerConnection = PeerConnection.socketToPeerConnectionMapper[socket];
            }
            else {
                peerConnection = new PeerConnection(socket);
                PeerConnection.addSocketToPeerConnectionMapper(socket, peerConnection);
                peerConnection.listenIceCandidate(iceCandidateListenCb);
            }
            return peerConnection;
        };
        PeerConnection.getVideoElementID = function (socketId) {
            return "remote-video-" + socketId;
        };
        PeerConnection.prototype.onRemoteTrack = function (_onRemoteTrakCB) {
            var _self = this;
            this.peerConnection.ontrack = function (_a) {
                var stream = _a.streams[0];
                _onRemoteTrakCB(stream);
                // const remoteVideo: any = document.getElementById(PeerConnection.getVideoElementID(_self.socketId));
                // if (remoteVideo) {
                //   remoteVideo.srcObject = stream;
                // }
            };
        };
        PeerConnection.prototype.listenIceCandidate = function (iceCandidateListenCb) {
            var _self = this;
            this.peerConnection.addEventListener('icecandidate', function handleConnectionLocal(event) {
                // const peerConnection = event.target;
                console.log('listenICECANDIDATE > ', event);
                console.log('listenICECANDIDATE > 1', event.candidate, _self.socketId);
                var iceCandidate = event.candidate;
                iceCandidateListenCb(iceCandidate, _self.socketId);
            });
        };
        PeerConnection.prototype.addIceCandidate = function (iceCandidate) {
            return __awaiter(this, void 0, void 0, function () {
                var newIceCandidate;
                return __generator(this, function (_a) {
                    console.log("icecandidate --- -- ", iceCandidate);
                    if (iceCandidate) {
                        newIceCandidate = new RTCIceCandidate(iceCandidate);
                        return [2 /*return*/, this.peerConnection.addIceCandidate(newIceCandidate)];
                    }
                    return [2 /*return*/];
                });
            });
        };
        PeerConnection.prototype.createOfferAndSetDescription = function () {
            return __awaiter(this, void 0, void 0, function () {
                var offer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.peerConnection.createOffer()];
                        case 1:
                            offer = _a.sent();
                            return [4 /*yield*/, this.peerConnection.setLocalDescription(new RTCSessionDescription(offer))];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, offer];
                    }
                });
            });
        };
        PeerConnection.prototype.setDescriptionAndGetAnswer = function (offer) {
            return __awaiter(this, void 0, void 0, function () {
                var answer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.peerConnection.createAnswer()];
                        case 2:
                            answer = _a.sent();
                            return [4 /*yield*/, this.peerConnection.setLocalDescription(new RTCSessionDescription(answer))];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, answer];
                    }
                });
            });
        };
        PeerConnection.prototype.setRemoteDescription = function (answer) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        PeerConnection.socketToPeerConnectionMapper = {};
        return PeerConnection;
    }());
    exports.PeerConnection = PeerConnection;
});
//# sourceMappingURL=PeerConection.js.map