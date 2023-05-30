import { WebSocketServer } from 'ws'
import * as url from 'url';


class WsProvider {
    constructor() {
        if (!WsProvider._instance) {
            this.wss = new WebSocketServer({ port: 7071 });
            this.clients = {};
            this.wss.on('connection', this.onConnection)
            WsProvider._instance = this
        }
        return WsProvider._instance;
    }

    onConnection = (ws, b) => {
        ws.send('Welcome to the chat, enjoy :)');
        const url_parts =  url.parse(b.url, true);
        const roomId = url_parts.query.roomId;

        if (roomId) {
            if (this.clients[roomId]) {
                this.clients[roomId].push(ws);
            } else {
                this.clients[roomId] = [ws];
            }
        }

        ws.on("close", () => {
            if (roomId) {
                this.clients[roomId] = this.clients[roomId].filter(i => i !== ws);
                if (!this.clients[roomId].length) {
                    delete this.clients[roomId]
                }
            }
        });
    }
}

export default WsProvider;