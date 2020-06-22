import {ChatRepository} from "../../domain/ChatRepository";
import {ChatRequest} from "./ChatRequest";
import {ChatResponse} from "./ChatResponse";
import {ChatId} from "../../domain/ChatId";
import {UserId} from "../../../Shared/domain/UserId";
import {ChatsByRequest} from "./ChatsByRequest";
import {ChatsByResponse} from "./ChatsByResponse";
import {InvalidArgumentError} from "../../../Shared/domain/value-object/InvalidArgumentError";

export class ChatsByFinder {
    protected repository: ChatRepository;

    constructor(repository: ChatRepository) {
        this.repository = repository
    }

    async run(request: ChatsByRequest): Promise<ChatsByResponse> {
        if(request.limit > 50){
            throw new InvalidArgumentError('The limit cannot exceed 50');
        }
        const chats = await this.repository.getByUserBy(new ChatId(request.user), request.offset, request.limit);
        const countChats = await this.repository.countByUser(new ChatId(request.user));

        return {
            total: countChats,
            chats: chats.map(chat => {
                const response: ChatResponse = {
                    id: chat.id.value,
                    users: chat.users.map(userId => userId.value),
                    unreadMessages: chat.getNumberUnreadMessages(new UserId(request.user))
                }
                const lastMessage = chat.getLastMessage();
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