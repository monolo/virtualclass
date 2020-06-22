import {UserId} from "../../Shared/domain/UserId";
import {DomainEvent} from "../../Shared/domain/DomainEvent";
import {ChatId} from "../../Chat/domain/ChatId";

type ChatCreatedDomainEventBody = {
    readonly users: Array<string>
};

type ChatCreatedDomainEventRequest = {
    id: string,
    users: Array<UserId>
    eventId?: string;
    occurredOn?: Date;
}

export class ChatCreatedDomainEvent extends DomainEvent {
    static readonly EVENT_NAME = 'chat.created';

    readonly users: Array<UserId>;

    constructor({id, users, eventId, occurredOn}: ChatCreatedDomainEventRequest) {
        super(ChatCreatedDomainEvent.EVENT_NAME, id, eventId, occurredOn);
        this.users = users
    }

    toPrimitive(): ChatCreatedDomainEventBody {
        const {users} = this;
        return {
            users: users.map(user => user.value)
        };
    }

    static fromPrimitives(
        aggregateId: string,
        body: ChatCreatedDomainEventBody,
        eventId: string,
        occurredOn: Date
    ): DomainEvent {
        return new ChatCreatedDomainEvent({
            id: aggregateId,
            users: body.users.map(userId => new UserId(userId)),
            eventId,
            occurredOn
        });
    }
}
