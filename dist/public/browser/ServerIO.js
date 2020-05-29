var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "socket.io"], function (require, exports, socket_io_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ServerIO = void 0;
    socket_io_1 = __importDefault(socket_io_1);
    var ServerIO = /** @class */ (function () {
        function ServerIO(httpServer) {
            this.activeSockets = [];
            this.io = socket_io_1.default(httpServer);
            this.handleSocketConnection();
        }
        ServerIO.prototype.handleSocketConnection = function () {
            var _this = this;
            this.io.on("connection", function (socket) {
                var existingSocket = _this.activeSockets.find(function (existingSocket) { return existingSocket === socket.id; });
                if (!existingSocket) {
                    _this.activeSockets.push(socket.id);
                    socket.emit("update-user-list", {
                        users: _this.activeSockets.filter(function (existingSocket) { return existingSocket !== socket.id; })
                    });
                    socket.broadcast.emit("update-user-list", {
                        users: [socket.id]
                    });
                }
                socket.on("call-user", function (data) {
                    console.log('In call-user', data, socket.id);
                    socket.to(data.to).emit("call-made", {
                        offer: data.offer,
                        socket: socket.id
                    });
                });
                socket.on("call-add-icecandidate", function (data) {
                    console.log('call-add-icecandidate', data.to);
                    socket.to(data.to).emit("add-icecandidate", {
                        iceCandidate: data.iceCandidate,
                        socket: socket.id
                    });
                });
                socket.on("make-answer", function (data) {
                    socket.to(data.to).emit("answer-made", {
                        socket: socket.id,
                        answer: data.answer
                    });
                });
                socket.on("reject-call", function (data) {
                    socket.to(data.from).emit("call-rejected", {
                        socket: socket.id
                    });
                });
                socket.on("disconnect", function () {
                    _this.activeSockets = _this.activeSockets.filter(function (existingSocket) { return existingSocket !== socket.id; });
                    socket.broadcast.emit("remove-user", {
                        socketId: socket.id
                    });
                });
            });
        };
        return ServerIO;
    }());
    exports.ServerIO = ServerIO;
});
//# sourceMappingURL=ServerIO.js.map