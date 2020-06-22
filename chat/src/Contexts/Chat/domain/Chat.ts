import {ChatId} from "./ChatId";
import {UserId} from "../../Shared/domain/UserId";
import {AggregateRoot} from "../../Shared/domain/AggregateRoot";
import {MessageId} from "../../Message/domain/MessageId";
import {MessageType} from "../../Message/domain/MessageType";
import {MessageReadDomainEvent} from "../../Message/domain/MessageReadDomainEvent";
import {ChatCreatedDomainEvent} from "./ChatCreatedDomainEvent";

type LastMessageType = {
    id: MessageId,
    type: MessageType
    value: string | Object,
    sender: UserId,
    createdAt: Date
}

export class Chat extends AggregateRoot{
    readonly id: ChatId;
    readonly users: Array<UserId>;
    protected lastMessage: LastMessageType | null;
    protected unreadMessagesUser: {[key: string]: Array<string>};

    protected constructor(id: ChatId, users: Array<UserId>) {
        super();
        this.id = id;
        this.users = users;
        this.lastMessage = null;
        this.unreadMessagesUser = {};
    }

    static create(
        id: ChatId, users: Array<UserId>
    ): Chat {
        const chat = new Chat(id, users);
        chat.record(new ChatCreatedDomainEvent({
            id: id.value,
            users: users
        }));
        return chat;
    }

    public addUnreadMessage(userId: UserId, messageId: MessageId) {
        if(!this.unreadMessagesUser[userId.value])
            this.unreadMessagesUser[userId.value] = [];
        this.unreadMessagesUser[userId.value].push(messageId.value)
    }

    public readMessages(userId: UserId) {
        if(this.unreadMessagesUser[userId.value]) {
            this.unreadMessagesUser[userId.value].map((messageId) => {
                this.record(new MessageReadDomainEvent({
                    id: messageId,
                    chatId: this.id,
                    readByUser: userId,
                    date: new Date()
                }));
            });
            this.unreadMessagesUser[userId.value] = [];
        }
    }

    public setLastMessage(message: LastMessageType){
        if(!this.lastMessage || message.createdAt > this.lastMessage.createdAt)
            this.lastMessage = message;
    }

    public getNumberUnreadMessages(userId: UserId): number{
        if(!this.unreadMessagesUser[userId.value])
            return 0;
        else
            return this.unreadMessagesUser[userId.value].length;
    }

    public getLastMessage(): LastMessageType | null {
        if(this.lastMessage) return this.lastMessage;
        return null;
    }

    toPrimitives(): any {
        return {
            id: this.id.value,
            users: this.users.map(user => user.value),
            lastMessage: (this.lastMessage) ? {
                id: this.lastMessage.id.value,
                type: this.lastMessage.type.value,
                value: this.lastMessage.value,
                sender: this.lastMessage.sender.value,
                createdAt: this.lastMessage.createdAt
            }: null,
            unreadMessagesUser: this.unreadMessagesUser
        }
    }

    static fromPrimitives(plainData: {
        id: string;
        users: Array<string>;
        lastMessage: null | {
            id: string;
            type: string;
            value: any;
            sender: string;
            createdAt: Date
        };
        unreadMessagesUser: {[key: string]: Array<string>}
    }): Chat {
        const chat = new Chat(
            new ChatId(plainData.id),
            plainData.users.map(user => new UserId(user))
        );
        if(plainData.lastMessage) chat.setLastMessage({
            id: new MessageId(plainData.lastMessage.id),
            type: new MessageType(plainData.lastMessage.type),
            value: plainData.lastMessage.value,
            sender: new UserId(plainData.lastMessage.sender),
            createdAt: plainData.lastMessage.createdAt
        });
        chat.unreadMessagesUser = plainData.unreadMessagesUser;
        return chat;
    }
}