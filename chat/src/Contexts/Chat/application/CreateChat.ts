import {ChatRepository} from "../domain/ChatRepository";
import {EventBus} from "../../Shared/domain/EventBus";
import {CreateChatRequest} from "./CreateChatRequest";
import {UserId} from "../../Shared/domain/UserId";
import {ChatAlreadyExists} from "../domain/ChatAlreadyExists";
import {Chat} from "../domain/Chat";
import {ChatId} from "../domain/ChatId";

export class CreateChat {
    private repository: ChatRepository;
    private eventBus: EventBus;

    constructor(repository: ChatRepository, eventBus: EventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: CreateChatRequest){
        let chat = await this.repository.ofUsers(new UserId(request.createdBy), new UserId(request.user));
        if(chat){
            throw new ChatAlreadyExists(chat.id);
        }
        chat = Chat.create(
            new ChatId(request.id),
            [new UserId(request.createdBy), new UserId(request.user)]
        );
        await this.repository.save(chat);
        await this.eventBus.publish(chat.pullDomainEvents());
    }
}