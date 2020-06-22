import {ChatId} from "./ChatId";

export class ChatAlreadyExists extends Error{
    readonly id: ChatId;
    constructor(id: ChatId) {
        super('Chat already exist');
        this.id = id;
    }
}