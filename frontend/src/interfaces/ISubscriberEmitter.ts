import websocket from "@/repositories/websocket/WebSocket";

export interface ISubscriberEmitter {
    room: string;
    token: string;

    events: Array<{ event: string, fn: Function }>
    on(event: string, fn: Function): void
    off(event: string, fn: Function): void
}