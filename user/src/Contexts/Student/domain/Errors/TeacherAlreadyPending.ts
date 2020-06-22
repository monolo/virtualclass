export class TeacherAlreadyPending extends Error {
    constructor() {
        super('The teacher is already pending');
    }
}