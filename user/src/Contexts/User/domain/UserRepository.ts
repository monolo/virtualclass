import {UserId} from "./value-object/UserId";
import {UserEmail} from "./value-object/UserEmail";
import {User} from "./User";

export interface UserRepository {
    ofId(id: UserId): Promise<User|null>
    ofEmail(email: UserEmail): Promise<User|null>
    getLessMeBy(id: UserId, offset: number, limit: number): Promise<Array<User>>
    countAll(): Promise<number>
}