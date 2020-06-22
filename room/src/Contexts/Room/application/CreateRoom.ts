import {RoomRepository} from "../domain/RoomRepository";
import {EventBus} from "../../Shared/domain/EventBus";
import {CreateRoomRequest} from "./CreateRoomRequest";
import {UserId} from "../../Shared/domain/UserId";
import {RoomAlreadyExists} from "../domain/RoomAlreadyExists";
import {Room} from "../domain/Room";
import {RoomId} from "../domain/RoomId";

export class CreateRoom {
    private repository: RoomRepository;
    private eventBus: EventBus;

    constructor(repository: RoomRepository, eventBus: EventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: CreateRoomRequest){
        let room = await this.repository.ofUsers(new UserId(request.createdBy), new UserId(request.user));
        if(room){
            throw new RoomAlreadyExists(room.id);
        }
        room = Room.create(
            new RoomId(request.id),
            [new UserId(request.createdBy), new UserId(request.user)]
        );
        await this.repository.save(room);
        await this.eventBus.publish(room.pullDomainEvents());
    }
}