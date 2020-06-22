import websocket from "@/repositories/websocket/WebSocket";

export default class SubscriberEmitter {
    readonly events: Array<{ event: string; fn: Function }> = [];
    readonly room: string;
    readonly token: string

    constructor(room: string, token: string) {
        this.room = room;
        this.token = token;
    }

    on(event: string, fn: Function) {
        websocket.socket.on(`${this.room}-${event}`, fn);
        this.events.push({event: event, fn: fn});
    }

    off(event: string, fn: Function) {
        websocket.socket.off(`${this.room}-${event}`, fn);
    }
}