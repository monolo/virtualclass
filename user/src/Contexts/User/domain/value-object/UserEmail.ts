import { InvalidArgumentError } from '../../../Shared/domain/value-object/InvalidArgumentError';
import {EmailValueObject} from "../../../Shared/domain/value-object/EmailValueObject";

export class UserEmail extends EmailValueObject {
    constructor(value: string) {
        super(value);
    }

    protected ensureEmailIsValid(value: string): void {
        if (!super.validate(value) ) {
            throw new InvalidArgumentError(`The UserEmail <${value}> is not a valid email`);
        }
    }
}
