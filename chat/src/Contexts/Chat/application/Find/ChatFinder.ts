import {ChatRepository} from "../../domain/ChatRepository";
import {ChatRequest} from "./ChatRequest";
import {ChatResponse} from "./ChatResponse";
import {UserId} from "../../../Shared/domain/UserId";
import {ChatId} from "../../domain/ChatId";

export class ChatFinder {
    protected repository: ChatRepository;

    constructor(repository: ChatRepository) {
        this.repository = repository
    }

    async run(request: ChatRequest): Promise<ChatResponse> {
        const chat = await this.repository.ofIdUser(new ChatId(request.id), new UserId(request.user));
        if(!chat){
            throw new Error('Chat not exists')
        }
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
    }
}