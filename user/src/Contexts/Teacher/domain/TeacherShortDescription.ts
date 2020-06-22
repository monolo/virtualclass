import { StringValueObject } from '../../Shared/domain/value-object/StringValueObject.s';
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError';

export class TeacherShortDescription extends StringValueObject {
    constructor(value: string) {
        super(value);
        this.ensureLengthIsLessThan80Characters(value);
    }

    private ensureLengthIsLessThan80Characters(value: string): void {
        if (value.length > 80) {
            throw new InvalidArgumentError(`The User Name <${value}> has more than 80 characters`);
        }
    }
}
