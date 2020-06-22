export class UserDoesNotExistError extends Error {
    constructor() {
        super('The user does not exists');
    }
}