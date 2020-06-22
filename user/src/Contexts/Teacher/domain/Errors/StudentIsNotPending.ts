export class StudentIsNotPending extends Error {
    constructor() {
        super('The student is not pending');
    }
}