export class TeacherIsNotPending extends Error {
    constructor() {
        super('The teacher is not pending');
    }
}