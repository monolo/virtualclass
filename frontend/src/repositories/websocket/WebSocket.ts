import io from 'socket.io-client'
import axios from "../AxiosRepository";
import {ISubscriberEmitter} from "@/interfaces/ISubscriberEmitter";
import SubscriberEmitter from "@/repositories/websocket/SubscriberEmitter";

const websocket = new class WebSocket {
    readonly random: number = Math.random();
    readonly socket: SocketIOClient.Socket;
    subscribers: Array<ISubscriberEmitter> = [];
    private tokens: any;

    constructor() {
        this.socket = io.connect(process.env.VUE_APP_WEBSSOCKET_URL);
        this.socket.on('reconnect', () => this.reconnectSubscribers());
    }

    public async subscriber(room: string): Promise<ISubscriberEmitter> {
        if (!this.socket) throw new Error('Websocket not connected');
        try {
            const token = 'asdfa';
            /*let token = this.tokens[room];
            if (!token) {
                const response = await axios.post(`/${room}/join`, {
                    room
                });
                token = response.data.token;
            }*/
            this.socket.emit('join', {
                room: room,
                token: token
            });
            const subscriber = new SubscriberEmitter(room, token);
            this.subscribers.push(subscriber);
            return subscriber;
        } catch (e) {
            throw new Error("Unauthorized");
        }
    }

    public async unsubscriber(subscriber: ISubscriberEmitter) {
        subscriber.events.forEach(event => {
            subscriber.off(event.event, event.fn);
        });
        const index = this.subscribers.findIndex(_subscriber => _subscriber == subscriber);
        if (index !== -1) this.subscribers.splice(index, 1);
    }

    private reconnectSubscribers() {
        this.subscribers.forEach((subscriber) => {
            this.socket.emit('join', {
                room: subscriber.room,
                token: subscriber.token
            });
        });
    }
}

export default websocket;