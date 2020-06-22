import { StringValueObject } from '../../../Shared/domain/value-object/StringValueObject.s';
import { InvalidArgumentError } from '../../../Shared/domain/value-object/InvalidArgumentError';

export class UserSurname extends StringValueObject {
    constructor(value: string) {
        super(value);
        this.ensureLengthIsLessThan50Characters(value);
    }

    private ensureLengthIsLessThan50Characters(value: string): void {
        if (value.length > 50) {
            throw new InvalidArgumentError(`The User Name <${value}> has more than 50 characters`);
        }
    }
}
