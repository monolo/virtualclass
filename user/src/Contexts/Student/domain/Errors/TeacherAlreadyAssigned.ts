export class TeacherAlreadyAssigned extends Error {
    constructor() {
        super('The teacher is already assigned');
    }
}