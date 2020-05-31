/// <reference types="node" />
import { Server as HTTPServer } from "http";
export declare class ServerIO {
    private activeSockets;
    private io;
    constructor(httpServer: HTTPServer);
    private handleSocketConnection;
}
