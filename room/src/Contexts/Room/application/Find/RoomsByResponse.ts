import {RoomResponse} from "./RoomResponse";

export type RoomsByResponse = {
    rooms: Array<RoomResponse>;
    total: number;
}