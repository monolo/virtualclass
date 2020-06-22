import {RoomRepository} from "../../domain/RoomRepository";
import {RoomRequest} from "./RoomRequest";
import {RoomResponse} from "./RoomResponse";
import {RoomId} from "../../domain/RoomId";
import {UserId} from "../../../Shared/domain/UserId";
import {RoomsByRequest} from "./RoomsByRequest";
import {RoomsByResponse} from "./RoomsByResponse";
import {InvalidArgumentError} from "../../../Shared/domain/value-object/InvalidArgumentError";

export class RoomsByFinder {
    protected repository: RoomRepository;

    constructor(repository: RoomRepository) {
        this.repository = repository
    }

    async run(request: RoomsByRequest): Promise<RoomsByResponse> {
        if(request.limit > 50){
            throw new InvalidArgumentError('The limit cannot exceed 50');
        }
        const rooms = await this.repository.getByUserBy(new RoomId(request.user), request.offset, request.limit);
        const countRooms = await this.repository.countByUser(new RoomId(request.user));

        return {
            total: countRooms,
            rooms: rooms.map(room => {
                const response: RoomResponse = {
                    id: room.id.value,
                    users: room.users.map(userId => userId.value),
                    unreadMessages: room.getNumberUnreadMessages(new UserId(request.user))
                }
                const lastMessage = room.getLastMessage();
                if(lastMessage) response.lastMessage = {
                    type: lastMessage.type.value,
                    value: lastMessage.value,
                    createdAt: lastMessage.createdAt
                }
                return response;
            })
        }
    }
}