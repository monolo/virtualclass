import {Message} from "./Message";
import {ChatId} from "../../Chat/domain/ChatId";

export interface MessageRepository {
    save(message: Message): Promise<void>
    lastMessages(chatId: ChatId, limit: number): Promise<Array<Message>>
}