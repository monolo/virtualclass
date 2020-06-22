import { StringValueObject } from '../../Shared/domain/value-object/StringValueObject.s';
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError';

export class TeacherFullDescription extends StringValueObject {
    constructor(value: string) {
        super(value);
        this.ensureLengthIsLessThan500Characters(value);
    }

    private ensureLengthIsLessThan500Characters(value: string): void {
        if (value.length > 500) {
            throw new InvalidArgumentError(`The User Name <${value}> has more than 500 characters`);
        }
    }
}
