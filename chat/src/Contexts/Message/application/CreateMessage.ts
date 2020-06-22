import {EventBus} from "../../Shared/domain/EventBus";
import {UserId} from "../../Shared/domain/UserId";
import {MessageRepository} from "../domain/MessageRepository";
import {CreateMessageRequest} from "./CreateMessageRequest";
import {Message} from "../domain/Message";
import {MessageId} from "../domain/MessageId";
import {ChatId} from "../../Chat/domain/ChatId";
import {MessageType} from "../domain/MessageType";

export class CreateMessage {
    private repository: MessageRepository;
    private eventBus: EventBus;

    constructor(repository: MessageRepository, eventBus: EventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: CreateMessageRequest) {
        const message = Message.create(
            new MessageId(request.id),
            new ChatId(request.chatId),
            new MessageType(request.type),
            request.value,
            new UserId(request.sender)
        );
        await this.repository.save(message);
        await this.eventBus.publish(message.pullDomainEvents());
    }
}