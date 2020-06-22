import {RoomId} from "./RoomId";
import {UserId} from "../../Shared/domain/UserId";
import {AggregateRoot} from "../../Shared/domain/AggregateRoot";
import {MessageId} from "../../Message/domain/MessageId";
import {MessageType} from "../../Message/domain/MessageType";
import {MessageReadDomainEvent} from "../../Message/domain/MessageReadDomainEvent";
import {RoomCreatedDomainEvent} from "./RoomCreatedDomainEvent";


export class Room extends AggregateRoot{
    readonly id: RoomId;
    readonly users: Array<UserId>;

    protected constructor(id: RoomId, users: Array<UserId>) {
        super();
        this.id = id;
        this.users = users;
    }

    static create(
        id: RoomId, users: Array<UserId>
    ): Room {
        const room = new Room(id, users);
        room.record(new RoomCreatedDomainEvent({
            id: id.value,
            users: users
        }));
        return room;
    }


    toPrimitives(): any {
        return {
            id: this.id.value,
            users: this.users.map(user => user.value),
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
    }): Room {
        const room = new Room(
            new RoomId(plainData.id),
            plainData.users.map(user => new UserId(user))
        );
        return room;
    }
}