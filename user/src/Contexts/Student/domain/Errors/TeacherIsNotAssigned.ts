export class TeacherIsNotAssigned extends Error {
    constructor() {
        super('The teacher is not assigned');
    }
}