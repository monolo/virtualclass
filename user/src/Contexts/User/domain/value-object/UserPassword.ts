import { StringValueObject } from '../../../Shared/domain/value-object/StringValueObject.s';
import { InvalidArgumentError } from '../../../Shared/domain/value-object/InvalidArgumentError';

export class UserPassword extends StringValueObject {
    constructor(value: string) {
        super(value);
        this.ensureLengthIsGreaterThan7AnLessThan15Characters(value);
    }

    private ensureLengthIsGreaterThan7AnLessThan15Characters(value: string): void {
        if (value.length < 8 && value.length > 15) {
            throw new InvalidArgumentError(`The User Name <${value}> has less than 8 characters and has more than 15 characters`);
        }
    }
}
