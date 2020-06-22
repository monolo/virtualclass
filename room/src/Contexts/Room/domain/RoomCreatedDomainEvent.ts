import {UserId} from "../../Shared/domain/UserId";
import {DomainEvent} from "../../Shared/domain/DomainEvent";
import {RoomId} from "../../Room/domain/RoomId";

type RoomCreatedDomainEventBody = {
    readonly users: Array<string>
};

type RoomCreatedDomainEventRequest = {
    id: string,
    users: Array<UserId>
    eventId?: string;
    occurredOn?: Date;
}

export class RoomCreatedDomainEvent extends DomainEvent {
    static readonly EVENT_NAME = 'room.created';

    readonly users: Array<UserId>;

    constructor({id, users, eventId, occurredOn}: RoomCreatedDomainEventRequest) {
        super(RoomCreatedDomainEvent.EVENT_NAME, id, eventId, occurredOn);
        this.users = users
    }

    toPrimitive(): RoomCreatedDomainEventBody {
        const {users} = this;
        return {
            users: users.map(user => user.value)
        };
    }

    static fromPrimitives(
        aggregateId: string,
        body: RoomCreatedDomainEventBody,
        eventId: string,
        occurredOn: Date
    ): DomainEvent {
        return new RoomCreatedDomainEvent({
            id: aggregateId,
            users: body.users.map(userId => new UserId(userId)),
            eventId,
            occurredOn
        });
    }
}
