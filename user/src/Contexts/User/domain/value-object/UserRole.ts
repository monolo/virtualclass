import { StringValueObject } from '../../../Shared/domain/value-object/StringValueObject.s';
import { InvalidArgumentError } from '../../../Shared/domain/value-object/InvalidArgumentError';

export class UserRole extends StringValueObject {
    static STUDENT: string = 'STUDENT';
    static TEACHER: string = 'TEACHER';

    static roles: Array<string> = [
        UserRole.STUDENT,
        UserRole.TEACHER
    ]

    constructor(value: string) {
        super(value);
        this.ensureRoleIsValid(value);
    }

    private ensureRoleIsValid(value: string): void {
        if (!UserRole.roles.includes(value)) {
            throw new InvalidArgumentError(`The User Role <${value}> is not valid`);
        }
    }
}
