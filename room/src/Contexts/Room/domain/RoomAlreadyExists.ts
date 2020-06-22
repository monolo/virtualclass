import {RoomId} from "./RoomId";

export class RoomAlreadyExists extends Error{
    readonly id: RoomId;
    constructor(id: RoomId) {
        super('Room already exist');
        this.id = id;
    }
}