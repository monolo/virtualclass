export interface Room {
    id: string;
    users: Array<string>;
    status: string
    duration: number,
    createdAt: Date
}

export interface RoomRepository {
    createRoom(id: string, userId: string): Promise<void>
    room(id:string): Promise<Room>
    roomStartConnection(id: string): Promise<string>
    roomFinishConnection(id: string): Promise<void>
}