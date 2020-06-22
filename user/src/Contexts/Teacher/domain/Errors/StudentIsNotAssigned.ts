export class StudentIsNotAssigned extends Error {
    constructor() {
        super('The student is not assigned');
    }
}