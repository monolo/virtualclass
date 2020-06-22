import {UserId} from "../../Shared/domain/UserId";
import {ChatId} from "../../Chat/domain/ChatId";
import {AggregateRoot} from "../../Shared/domain/AggregateRoot";
import {WebSocketDomainEvent} from "../../Shared/domain/WebSocketDomainEvent";
import {MessageId} from "./MessageId";
import {MessageCreatedDomainEvent} from "./MessageCreatedDomainEvent";
import {MessageType} from "./MessageType";

export class Message extends AggregateRoot {
    readonly id: MessageId;
    readonly chatId: ChatId;
    readonly value: string | Object;
    readonly type: MessageType;
    readonly createdAt: Date;
    readonly sender: UserId;
    protected readBy: {
        [key: string]: Date;
    } | undefined

    constructor(id: MessageId, chatId: ChatId, type: MessageType, value: string | Object, sender: UserId, createdAt?: Date) {
        super();
        this.id = id;
        this.chatId = chatId;
        this.type = type;
        this.value = value;
        this.sender = sender
        this.createdAt = (createdAt)?createdAt:new Date();
    }

    static create(
        id: MessageId, chatId: ChatId, type: MessageType, value: string | Object, sender: UserId
    ): Message {
        const message = new Message(id, chatId, type, value, sender);
        message.record(new MessageCreatedDomainEvent({
            id: id.value,
            type: type.value,
            chatId,
            sender,
            value
        }));
        message.record(new WebSocketDomainEvent(id.value, `/chat/${chatId.value}`, 'message', message.toPrimitives()));
        return message;
    }

    public readMessage(userId: UserId, date: Date) {
        this.addReadBy(userId, date);
        this.record(new WebSocketDomainEvent(this.id.value, `/chat/${this.chatId.value}`, 'message read', {
            messageId: this.id.value,
            userId: userId.value,
            date: date
        }));
    }

    public addReadBy(userId: UserId, date: Date) {
        if (!this.readBy)
            this.readBy = {};
        this.readBy[userId.value] = date;
    }

    toPrimitives(): any {
        return {
            id: this.id.value,
            chatId: this.chatId.value,
            value: this.value,
            type: this.type.value,
            createdAt: this.createdAt,
            sender: this.sender.value,
            readBy: this.readBy
        }
    }

    static fromPrimitives(data: {
        id: string,
        chatId: string,
        value: string | Object,
        type: string,
        createdAt: string
        sender: string,
        readBy: { [key: string]: Date } | undefined
    }): Message {
        const message = new Message(new MessageId(data.id), new ChatId(data.chatId), new MessageType(data.type), data.value, new UserId(data.sender), new Date(data.createdAt));
        if (data.readBy)
            Object.keys(data.readBy).map((userId) => {
                if (data.readBy && data.readBy[userId])
                    message.addReadBy(new UserId(userId), data.readBy[userId]);
            });
        return message;
    }
}