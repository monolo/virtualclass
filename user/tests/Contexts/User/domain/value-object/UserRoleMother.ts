import {UserRole} from "../../../../../src/Contexts/User/domain/value-object/UserRole";

export class UserRoleMother {
    static create(value: string): UserRole {
        return new UserRole(value);
    }
}
