import io from 'socket.io';
import {RabbitMqEventBus} from "../infrastructure/EventBus/rabbitmq/RabbitMqEventBus";
import {RabbitMqClientFactory} from "../infrastructure/EventBus/rabbitmq/RabbitMqClientFactory";
import {OnWebsocketEmit} from "../application/OnWebsocketEmit";
import {WebSocketDomainEvent} from "../domain/WebSocketDomainEvent";
import jwt from 'jsonwebtoken';
import config from "./config/config";

const port = process.env.PORT || 3000;
const server = io.listen(port);

const rabbitMqEventBus = new RabbitMqEventBus(RabbitMqClientFactory.createClient('default'));
(async () => {
    try {
        await rabbitMqEventBus.addSubscribers([
            new OnWebsocketEmit((webSocketDomainEvent: WebSocketDomainEvent) => {
                const room = webSocketDomainEvent.room;
                const event = `${room}-${webSocketDomainEvent.event}`;
                server.sockets.in(room).emit(event, webSocketDomainEvent.data);
                console.log(`Event ${event} emited to room ${room}`);
            })
        ]);
    } catch (e) {
        console.log(e);
    }
})();

server.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);
    socket.on('join', async (data: { room: string, token: string }) => {
        jwt.verify(data.token, config.get('jwtSecret'), (err, decoded) => {
            //Todo comentamos pra tear, sin las restricciones de autorizacion
            // @ts-ignore
            /*if(err || !decoded || !decoded.room ||decoded.room !== data.room) {
                socket.emit(`${data.room}-error`, {
                    error: 'Invalid token'
                });
                console.log(`${data.room}-error`)
                return;
            }*/
            socket.join(data.room);
            socket.emit(`${data.room}-connected`);
        });
    });
    //Todo: solo para testear, en produccion no es valido
    socket.on('emit room', (data:any) => {
        const room = data.room;
        const event = `${room}-${data.event}`;
        server.sockets.in(data.room).emit(event, data.data);
    });
});

console.log(`Socket listen in port ${port}`);