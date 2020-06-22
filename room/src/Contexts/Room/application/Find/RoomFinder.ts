import {RoomRepository} from "../../domain/RoomRepository";
import {RoomRequest} from "./RoomRequest";
import {RoomResponse} from "./RoomResponse";
import {UserId} from "../../../Shared/domain/UserId";
import {RoomId} from "../../domain/RoomId";

export class RoomFinder {
    protected repository: RoomRepository;

    constructor(repository: RoomRepository) {
        this.repository = repository
    }

    async run(request: RoomRequest): Promise<RoomResponse> {
        const room = await this.repository.ofIdUser(new RoomId(request.id), new UserId(request.user));
        if(!room){
            throw new Error('Room not exists')
        }
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
    }
}