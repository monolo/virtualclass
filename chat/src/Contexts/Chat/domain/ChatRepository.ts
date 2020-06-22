import {UserId} from "../../Shared/domain/UserId";
import {Chat} from "./Chat";
import {ChatId} from "./ChatId";

export interface ChatRepository {
    ofIdUser(id: ChatId, user: UserId): Promise<Chat|null>
    ofUsers(user1Id: UserId, user2Id: UserId): Promise<Chat|null>
    getByUserBy(userId: UserId, offset: number, limit: number): Promise<Array<Chat>>
    countByUser(userId: UserId): Promise<number>
    save(chat: Chat): Promise<void>
}