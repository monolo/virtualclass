import {ChatRepository} from "../../domain/ChatRepository";
import {MongoRepository} from "../../../Shared/infrastructure/persistence/mongo/MongoRepository";
import {UserId} from "../../../Shared/domain/UserId";
import {Chat} from "../../domain/Chat";
import {ChatId} from "../../domain/ChatId";

export class MongoChatRepository extends MongoRepository<any> implements ChatRepository{
    public async countByUser(userId: UserId): Promise<number> {
        const collection = await this.collection();
        return collection.countDocuments({users: userId.value});
    }

    public async getByUserBy(userId: UserId, offset: number, limit: number): Promise<Array<Chat>> {
        const collection = await this.collection();
        const chats = await collection.find({users: userId.value}).skip(offset).limit(limit).toArray();
        return chats.length > 0 ? chats.map(chat => Chat.fromPrimitives({...chat, id: chat._id})) : [];
    }

    public async ofIdUser(id: ChatId, user: UserId): Promise<Chat | null> {
        const collection = await this.collection();
        const chat = await collection.findOne({
            _id: id.value,
            users: user.value
        });
        return chat ? Chat.fromPrimitives({...chat, id: chat._id}) : null;
    }

    public async ofUsers(user1Id: UserId, user2Id: UserId): Promise<Chat | null> {
        const collection = await this.collection();
        const chat = await collection.findOne({
            users: {$all: [user1Id.value, user2Id.value]}
        });
        return chat ? Chat.fromPrimitives({...chat, id: chat._id}) : null;
    }

    public async save(chat: Chat): Promise<void> {
        await this.persist(chat.id.value, chat);
    }

    protected moduleName(): string {
        return "chat";
    }
}