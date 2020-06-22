import {StringValueObject} from "../../Shared/domain/value-object/StringValueObject.s";
import {InvalidArgumentError} from "../../Shared/domain/value-object/InvalidArgumentError";

export class MessageType extends StringValueObject{
    static readonly TEXT_TYPE = 'text';
    static readonly LOCATION_TYPE = 'location';
    static readonly MEDIA_TYPE = 'media';

    readonly types = [MessageType.TEXT_TYPE, MessageType.LOCATION_TYPE, MessageType.MEDIA_TYPE];
    constructor(value: string) {
        super(value);
        this.isValidType(value);
    }

    private isValidType(value: string): void {
        if(!this.types.includes(value)){
            throw new InvalidArgumentError('Type not valid');
        }
    }
}