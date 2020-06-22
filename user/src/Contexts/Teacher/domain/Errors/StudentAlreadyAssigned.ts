export class StudentAlreadyAssigned extends Error {
    constructor() {
        super('The student is already assigned');
    }
}