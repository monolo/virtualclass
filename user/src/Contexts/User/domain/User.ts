import {UserId} from "./value-object/UserId";
import {UserName} from "./value-object/UserName";
import {UserSurname} from "./value-object/UserSurname";
import {AggregateRoot} from "../../Shared/domain/AggregateRoot";
import {UserRole} from "./value-object/UserRole";
import {UserPassword} from "./value-object/UserPassword";
import {UserCreatedDomainEvent} from "./UserCreatedDomainEvent";
import {UserEmail} from "./value-object/UserEmail";

export class User extends AggregateRoot {
    readonly id: UserId;
    readonly name: UserName;
    readonly surname: UserSurname;
    readonly email: UserEmail;
    readonly password: UserPassword;
    readonly roles: Array<UserRole>

    protected constructor(id: UserId, name: UserName, surname: UserSurname, email: UserEmail, password: UserPassword, roles: Array<UserRole>) {
        super();
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }

    protected onCreated(user: User) {
        user.record(
            new UserCreatedDomainEvent({
                id: user.id.value,
                name: user.name.value,
                surname: user.surname.value,
                roles: user.roles.map((role) => role.value)
            })
        )
    }

    static fromPrimitives(plainData: { id: string; name: string; surname: string; email: string; password: string; roles: Array<string> }): User {
        return new User(
            new UserId(plainData.id),
            new UserName(plainData.name),
            new UserSurname(plainData.surname),
            new UserEmail(plainData.email),
            new UserPassword(plainData.password),
            plainData.roles.map(role => new UserRole(role))
        );
    }

    toPrimitives(): any {
        return {
            id: this.id.value,
            name: this.name.value,
            surname: this.surname.value,
            email: this.email.value,
            password: this.password.value,
            roles: this.roles.map(role => role.value)
        }
    }
}