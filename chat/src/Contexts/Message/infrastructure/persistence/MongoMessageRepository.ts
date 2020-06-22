import {MongoRepository} from "../../../Shared/infrastructure/persistence/mongo/MongoRepository";
import {MessageRepository} from "../../domain/MessageRepository";
import {Message} from "../../domain/Message";
import {ChatId} from "../../../Chat/domain/ChatId";

export class MongoMessageRepository extends MongoRepository<any> implements MessageRepository{
    public async save(message: Message): Promise<void> {
        await this.persist(message.id.value, message);
    }

    public async lastMessages(chatId: ChatId, limit: number): Promise<Array<Message>> {
        const collection = await this.collection();
        const messages = await collection
            .find({chatId: chatId.value})
            .limit(limit)
            .sort({createdAt: -1})
            .toArray();
        return messages.length > 0 ? messages.map(message => Message.fromPrimitives({...message, id: message._id})) : [];
    }

    protected moduleName(): string {
        return "message";
    }
}