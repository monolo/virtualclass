import {DomainEvent} from "./DomainEvent";

type WebSocketDomainEventBody = {
    readonly room: string;
    readonly event: string;
    readonly data: Object
}

export class WebSocketDomainEvent extends DomainEvent {
    static readonly EVENT_NAME = 'websocket.emit';
    readonly room: string;
    readonly event: string;
    readonly data: Object

    constructor(aggregateId: string, room: string, event: string, data: Object, eventId?: string, occurredOn?: Date) {
        super(WebSocketDomainEvent.EVENT_NAME, aggregateId, eventId, occurredOn);
        this.room = room;
        this.event = event;
        this.data = data;
    }

    toPrimitive(): WebSocketDomainEventBody {
        return {
            room: this.room,
            event: this.event,
            data: this.data
        };
    }

    static fromPrimitives(
        aggregateId: string,
        body: WebSocketDomainEventBody,
        eventId: string,
        occurredOn: Date
    ): DomainEvent {
        return new WebSocketDomainEvent(aggregateId, body.room, body.event, body.data, eventId, occurredOn)
    }
}