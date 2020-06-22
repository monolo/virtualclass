import {EventBus} from "../../../domain/EventBus";
import {DomainEvent} from "../../../domain/DomainEvent";
import {DomainEventSubscriber} from "../../../domain/DomainEventSubscriber";
import {Connection} from "amqplib";
import config from "../../../../../app/config/config";

export class RabbitMqEventBus implements EventBus{
    constructor(private _client: Promise<Connection>) {}

    protected client(): Promise<Connection> {
        return this._client;
    }

    public async addSubscribers(subscribers: Array<DomainEventSubscriber<DomainEvent>>): Promise<void> {
        if(subscribers.length == 0)
            return;
        const channel = await (await this._client).createChannel();
        const queue = config.get('rabbitmq.queue');
        const noAck = config.get('rabbitmq.noAck');
        await channel.assertQueue(queue);
        subscribers.map(async (subscriber) => {
            subscriber.subscribedTo().map(async event => {
                await channel.assertExchange(event.EVENT_NAME, 'fanout')
                await channel.bindQueue(queue, event.EVENT_NAME, '');
            })
        });
        await channel.consume(queue, (message) => {
            if(!message)
                return;
            const content = JSON.parse(message.content.toString())
            const eventName = content.eventName;
            try {
                subscribers.map(async (subscriber) => {
                    if (subscriber.subscribedTo().some(event => event.EVENT_NAME === eventName)) {
                        const domainEvent = subscriber.subscribedTo()[0]
                            .fromPrimitives(content.aggregateId, content.body, content.eventId, content.occurredOn);
                        await subscriber.on(domainEvent);
                    }
                });
                if(!noAck) channel.ack(message)
            }
            catch (e) {
                console.log(e);
            }
        }, {
            noAck: noAck
        })
    }

    public async publish(events: Array<DomainEvent>): Promise<void> {
        const channel = await (await this._client).createChannel();

        events.map(async (event) => {
            const exchangeName = event.eventName;
            await channel.assertExchange(event.eventName, 'fanout');

            const message = {
                eventName: event.eventName,
                aggregateId: event.aggregateId,
                body: event.toPrimitive(),
                eventId: event.eventId,
                occurredOn: event.occurredOn
            }

            const sent = await channel.publish(
                exchangeName,
                '',
                Buffer.from(JSON.stringify(message)),
                {
                    persistent: true
                }
            );

            if(!sent) throw new Error(`Event ${event.eventName} failed to send`)
        });
    }
}