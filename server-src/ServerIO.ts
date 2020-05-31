
import socketIO, { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";

export class ServerIO {

    private activeSockets: string[] = [];
    private io: SocketIOServer;
    
    constructor(httpServer: HTTPServer) {
        this.io = socketIO(httpServer);
        this.handleSocketConnection();
    }

    private handleSocketConnection(): void {
        this.io.on("connection", socket => {
          const existingSocket = this.activeSockets.find(
            existingSocket => existingSocket === socket.id
          );
    
          if (!existingSocket) {
            this.activeSockets.push(socket.id);
    
            socket.emit("my-socket-id", socket.id);
            
            socket.emit("update-user-list", {
              users: this.activeSockets
            });
            socket.broadcast.emit("update-user-list", {
              users: this.activeSockets
            });
            
            // socket.emit("update-user-list", {
            //   users: this.activeSockets.filter(
            //     existingSocket => existingSocket !== socket.id
            //   )
            // });
    
            // socket.broadcast.emit("update-user-list", {
            //   users: [socket.id]
            // });
          }
    
          socket.on("call-user", (data: any) => {
            console.log('In call-user', data, socket.id);
            socket.to(data.to).emit("call-made", {
              offer: data.offer,
              socket: socket.id
            });
          });
    
          socket.on("call-add-icecandidate", (data: any) => {
            console.log('call-add-icecandidate', data.to)
            socket.to(data.to).emit("add-icecandidate", {
              iceCandidate: data.iceCandidate,
              socket: socket.id
            });
          });
    
          socket.on("make-answer", data => {
            socket.to(data.to).emit("answer-made", {
              socket: socket.id,
              answer: data.answer
            });
          });
    
          socket.on("reject-call", data => {
            socket.to(data.from).emit("call-rejected", {
              socket: socket.id
            });
          });
    
          socket.on("disconnect", () => {

            console.log('disconnect > socketId -- -- ', socket.id);
            console.log('disconnect > this.activeSockets', this.activeSockets);
            this.activeSockets = this.activeSockets.filter(
              existingSocket => existingSocket !== socket.id
            );
            console.log('disconnect > this.activeSockets after', this.activeSockets);

            socket.broadcast.emit("update-user-list", {
              users: this.activeSockets
            });

            // socket.broadcast.emit("remove-user", {
            //   socketId: socket.id
            // });
          });
        });
      }
}