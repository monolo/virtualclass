import {WordMother} from "../../../Shared/domain/WordMother";
import {UserSurname} from "../../../../../src/Contexts/User/domain/value-object/UserSurname";

export class UserSurnameMother {
    static create(value: string): UserSurname {
        return new UserSurname(value);
    }

    static random(): UserSurname {
        return this.create(WordMother.random());
    }
}
