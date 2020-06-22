import {MongoRepository} from "../../../Shared/infrastructure/persistence/mongo/MongoRepository";
import {User} from "../../domain/User";
import {UserRepository} from "../../domain/UserRepository";
import {UserEmail} from "../../domain/value-object/UserEmail";
import {UserId} from "../../domain/value-object/UserId";

export class MongoUserRepository extends MongoRepository<User> implements UserRepository {
    public async ofId(id: UserId): Promise<User | null> {
        const collection = await this.collection();
        const user = await collection.findOne({_id: id.value});
        return user ? User.fromPrimitives({...user, id: user._id}) : null;
    }

    public async ofEmail(email: UserEmail): Promise<User | null> {
        const collection = await this.collection();
        const user = await collection.findOne({email: email.value});
        return user ? User.fromPrimitives({...user, id: user._id}) : null;
    }

    public async getLessMeBy(id: UserId, offset: number, limit: number): Promise<Array<User>> {
        const collection = await this.collection();
        const users = await collection.find({_id: {$ne: id.value}}).skip(offset).limit(limit).toArray();
        return users.length > 0 ? users.map(user => User.fromPrimitives({...user, id: user._id})) : [];
    }

    public async countAll(): Promise<number> {
        const collection = await this.collection();
        return collection.countDocuments();
    }

    protected moduleName(): string {
        return "user";
    }
}