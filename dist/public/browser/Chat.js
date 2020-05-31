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
define(["require", "exports", "./PeerConection", "./PeerConection"], function (require, exports, PeerConection_1, PeerConection_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Chat = void 0;
    Object.defineProperty(exports, "PeerConnection", { enumerable: true, get: function () { return PeerConection_2.PeerConnection; } });
    // const { RTCPeerConnection, RTCSessionDescription } = window;
    var Chat = /** @class */ (function () {
        function Chat() {
            var _this = this;
            this.iceCandidateListenCb = function (iceCandidate, socketId) {
                _this.socket.emit("call-add-icecandidate", {
                    iceCandidate: iceCandidate,
                    to: socketId
                });
            };
        }
        Chat.getLocalStream = function () {
            return PeerConection_1.PeerConnection.stream;
        };
        Chat.prototype.connect = function (connectionString) {
            // "localhost:5000"
            this.socket = io.connect(connectionString);
            this.attachBasicIosToSocket();
        };
        Chat.prototype.watchOnSocketIds = function (socketIdsChangeCB) {
            var _this = this;
            this.socket.on("update-user-list", function (_a) {
                var users = _a.users;
                users = users.filter(function (_user) {
                    _user != _this.mySocketId;
                });
                socketIdsChangeCB(users);
            });
        };
        Chat.prototype.attachBasicIosToSocket = function () {
            var _this = this;
            this.socket.on("add-icecandidate", function (data) { return __awaiter(_this, void 0, void 0, function () {
                var peerConnectionM;
                return __generator(this, function (_a) {
                    peerConnectionM = PeerConection_1.PeerConnection.getPeerConnection(data.socket, this.iceCandidateListenCb);
                    peerConnectionM.addIceCandidate(data.iceCandidate);
                    return [2 /*return*/];
                });
            }); });
            this.socket.on("my-socket-id", function (mySocketId) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.mySocketId = mySocketId;
                    return [2 /*return*/];
                });
            }); });
            this.socket.on("call-made", function (data) { return __awaiter(_this, void 0, void 0, function () {
                var peerConnectionM, answer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            peerConnectionM = PeerConection_1.PeerConnection.getPeerConnection(data.socket, this.iceCandidateListenCb);
                            return [4 /*yield*/, peerConnectionM.setDescriptionAndGetAnswer(data.offer)];
                        case 1:
                            answer = _a.sent();
                            this.socket.emit("make-answer", {
                                answer: answer,
                                to: data.socket
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            this.socket.on("answer-made", function (data) { return __awaiter(_this, void 0, void 0, function () {
                var peerConnectionM;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            peerConnectionM = PeerConection_1.PeerConnection.getPeerConnection(data.socket, this.iceCandidateListenCb);
                            return [4 /*yield*/, peerConnectionM.setRemoteDescription(data.answer)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        Chat.prototype.usMyCameraStream = function (_useMyCameraStreamCB) {
            navigator.getUserMedia({ video: true, audio: true }, function (stream) {
                PeerConection_1.PeerConnection.setStream(stream);
                _useMyCameraStreamCB(stream);
            }, function (error) {
                console.warn(error.message);
            });
        };
        Chat.prototype.useThisStream = function (_stream) {
            PeerConection_1.PeerConnection.setStream(_stream);
        };
        Chat.prototype.callToSocket = function (socketId) {
            return __awaiter(this, void 0, void 0, function () {
                var peerConnectionM, offer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            peerConnectionM = PeerConection_1.PeerConnection.getPeerConnection(socketId, this.iceCandidateListenCb);
                            return [4 /*yield*/, peerConnectionM.createOfferAndSetDescription()];
                        case 1:
                            offer = _a.sent();
                            this.socket.emit("call-user", {
                                offer: offer,
                                to: socketId
                            });
                            return [2 /*return*/, peerConnectionM];
                    }
                });
            });
        };
        return Chat;
    }());
    exports.Chat = Chat;
});
//# sourceMappingURL=Chat.js.map