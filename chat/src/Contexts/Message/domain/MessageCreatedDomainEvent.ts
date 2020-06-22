import {UserId} from "../../Shared/domain/UserId";
import {DomainEvent} from "../../Shared/domain/DomainEvent";
import {ChatId} from "../../Chat/domain/ChatId";

type MessageCreatedDomainEventBody = {
    readonly type: string,
    readonly chatId: string,
    readonly sender: string,
    readonly value: string | Object
};

type MessageCreatedDomainEventRequest = {
    id: string,
    type: string,
    chatId: ChatId,
    sender: UserId,
    value: string | Object
    eventId?: string;
    occurredOn?: Date;
}

export class MessageCreatedDomainEvent extends DomainEvent {
    static readonly EVENT_NAME = 'chat.message.created';

    readonly type: string;
    readonly chatId: ChatId;
    readonly sender: UserId;
    readonly value: string | Object;

    constructor({id, type, chatId, sender, value, eventId, occurredOn}: MessageCreatedDomainEventRequest) {
        super(MessageCreatedDomainEvent.EVENT_NAME, id, eventId, occurredOn);
        this.type = type;
        this.chatId = chatId;
        this.sender = sender;
        this.value = value
    }

    toPrimitive(): MessageCreatedDomainEventBody {
        const {type, chatId, sender, value} = this;
        return {
            type,
            chatId: chatId.value,
            sender: sender.value,
            value
        };
    }

    static fromPrimitives(
        aggregateId: string,
        body: MessageCreatedDomainEventBody,
        eventId: string,
        occurredOn: Date
    ): DomainEvent {
        return new MessageCreatedDomainEvent({
            id: aggregateId,
            type: body.type,
            chatId: new ChatId(body.chatId),
            sender: new UserId(body.sender),
            value: body.value,
            eventId,
            occurredOn
        });
    }
}
