import {DomainEvent} from "../../Shared/domain/DomainEvent";

type CreateUserDomainEventBody = {
    readonly name: string;
    readonly surname: string;
    readonly roles: Array<string>;
};

type UserCreatedDomainEventRequest = {
    id: string;
    eventId?: string;
    name: string;
    surname: string;
    roles: Array<string>;
    occurredOn?: Date;
}

export class UserCreatedDomainEvent extends DomainEvent {
    static readonly EVENT_NAME = 'user.created';

    readonly name: string;
    readonly surname: string;
    readonly roles: Array<string>;

    constructor({id, name, surname, roles, eventId, occurredOn}: UserCreatedDomainEventRequest) {
        super(UserCreatedDomainEvent.EVENT_NAME, id, eventId, occurredOn);
        this.name = name;
        this.surname = surname;
        this.roles = roles;
    }

    toPrimitive(): CreateUserDomainEventBody {
        const {name, surname, roles} = this;
        return {
            name,
            surname,
            roles
        };
    }

    static fromPrimitives(
        aggregateId: string,
        body: CreateUserDomainEventBody,
        eventId: string,
        occurredOn: Date
    ): DomainEvent {
        return new UserCreatedDomainEvent({
            id: aggregateId,
            name: body.name,
            surname: body.surname,
            roles: body.roles,
            eventId,
            occurredOn
        });
    }
}
