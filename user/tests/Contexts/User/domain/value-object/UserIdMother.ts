import {UserEmail} from "../../../../../src/Contexts/User/domain/value-object/UserEmail";
import {UserId} from "../../../../../src/Contexts/User/domain/value-object/UserId";
import {UuidMother} from "../../../Shared/domain/UuidMother";

export class UserIdMother {
    static create(value: string): UserId {
        return new UserId(value);
    }

    static random(): UserId {
        return this.create(UuidMother.random())
    }
}
