import {UserId} from "../../../Shared/domain/UserId";
import {MessageRepository} from "../../domain/MessageRepository";
import {MessagesByRequest} from "./MessagesByRequest";
import {ChatRepository} from "../../../Chat/domain/ChatRepository";
import {ChatId} from "../../../Chat/domain/ChatId";
import {MessagesByResponse} from "./MessagesByResponse";

export class MessagesByFinder {
    protected repositoryMessage: MessageRepository;
    protected repositoryChat: ChatRepository;

    constructor(repositoryMessage: MessageRepository, repositoryChat: ChatRepository) {
        this.repositoryMessage = repositoryMessage;
        this.repositoryChat = repositoryChat
    }

    async run(request: MessagesByRequest): Promise<MessagesByResponse> {
        const limit = 50;
        const chat = await this.repositoryChat.ofIdUser(new ChatId(request.chatId), new UserId(request.userId));
        if(!chat) {
            throw new Error("Chat not found");
        }
        const messages = await this.repositoryMessage.lastMessages(chat.id, limit);
        return {
            messages: messages.map(message => {
                return message.toPrimitives();
            })
        }
    }
}