import {UserId} from "../../Shared/domain/UserId";
import {Room} from "./Room";
import {RoomId} from "./RoomId";

export interface RoomRepository {
    ofIdUser(id: RoomId, user: UserId): Promise<Room|null>
    ofUsers(user1Id: UserId, user2Id: UserId): Promise<Room|null>
    getByUserBy(userId: UserId, offset: number, limit: number): Promise<Array<Room>>
    countByUser(userId: UserId): Promise<number>
    save(room: Room): Promise<void>
}