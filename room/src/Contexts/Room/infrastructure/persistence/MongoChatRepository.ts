import {RoomRepository} from "../../domain/RoomRepository";
import {MongoRepository} from "../../../Shared/infrastructure/persistence/mongo/MongoRepository";
import {UserId} from "../../../Shared/domain/UserId";
import {Room} from "../../domain/Room";
import {RoomId} from "../../domain/RoomId";

export class MongoRoomRepository extends MongoRepository<any> implements RoomRepository{
    public async countByUser(userId: UserId): Promise<number> {
        const collection = await this.collection();
        return collection.countDocuments({users: userId.value});
    }

    public async getByUserBy(userId: UserId, offset: number, limit: number): Promise<Array<Room>> {
        const collection = await this.collection();
        const rooms = await collection.find({users: userId.value}).skip(offset).limit(limit).toArray();
        return rooms.length > 0 ? rooms.map(room => Room.fromPrimitives({...room, id: room._id})) : [];
    }

    public async ofIdUser(id: RoomId, user: UserId): Promise<Room | null> {
        const collection = await this.collection();
        const room = await collection.findOne({
            _id: id.value,
            users: user.value
        });
        return room ? Room.fromPrimitives({...room, id: room._id}) : null;
    }

    public async ofUsers(user1Id: UserId, user2Id: UserId): Promise<Room | null> {
        const collection = await this.collection();
        const room = await collection.findOne({
            users: {$all: [user1Id.value, user2Id.value]}
        });
        return room ? Room.fromPrimitives({...room, id: room._id}) : null;
    }

    public async save(room: Room): Promise<void> {
        await this.persist(room.id.value, room);
    }

    protected moduleName(): string {
        return "room";
    }
}