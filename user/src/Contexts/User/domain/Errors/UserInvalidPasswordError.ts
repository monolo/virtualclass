export class UserInvalidPasswordError extends Error {
    constructor() {
        super('Invalid password');
    }
}