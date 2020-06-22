export class StudentAlreadyPending extends Error {
    constructor() {
        super('The student is already pending');
    }
}