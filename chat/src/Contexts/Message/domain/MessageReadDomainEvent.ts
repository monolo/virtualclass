import {UserId} from "../../Shared/domain/UserId";
import {DomainEvent} from "../../Shared/domain/DomainEvent";
import {ChatId} from "../../Chat/domain/ChatId";

type MessageReadDomainEventBody = {
    readonly chatId: string;
    readonly readByUser: string;
    readonly date: Date;
};

type MessageReadDomainEventRequest = {
    id: string;
    chatId: ChatId;
    readByUser: UserId;
    date: Date;
    eventId?: string;
    occurredOn?: Date;
}

export class MessageReadDomainEvent extends DomainEvent {
    static readonly EVENT_NAME = 'chat.message.read';

    readonly readByUser: UserId;
    readonly date: Date;
    readonly chatId: ChatId;

    constructor({id, chatId, readByUser, date, eventId, occurredOn}: MessageReadDomainEventRequest) {
        super(MessageReadDomainEvent.EVENT_NAME, id, eventId, occurredOn);
        this.readByUser = readByUser;
        this.date = date;
        this.chatId = chatId;
    }

    toPrimitive(): MessageReadDomainEventBody {
        const {chatId, readByUser, date} = this;
        return {
            chatId: chatId.value,
            readByUser: readByUser.value,
            date,
        };
    }

    static fromPrimitives(
        aggregateId: string,
        body: MessageReadDomainEventBody,
        eventId: string,
        occurredOn: Date
    ): DomainEvent {
        return new MessageReadDomainEvent({
            id: aggregateId,
            chatId: new ChatId(body.chatId),
            readByUser: new UserId(body.readByUser),
            date: body.date,
            eventId,
            occurredOn
        });
    }
}
