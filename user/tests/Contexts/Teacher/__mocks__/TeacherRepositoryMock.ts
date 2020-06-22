import {TeacherRepository} from "../../../../src/Contexts/Teacher/domain/TeacherRepository";
import {Teacher} from "../../../../src/Contexts/Teacher/domain/Teacher";
import {UserEmail} from "../../../../src/Contexts/User/domain/value-object/UserEmail";
import {UserId} from "../../../../src/Contexts/User/domain/value-object/UserId";

export class TeacherRepositoryMock implements TeacherRepository {
    private mockSave = jest.fn();
    private mockFind = jest.fn();
    private teacher: Teacher | null = null;

    async ofEmail(email: UserEmail): Promise<Teacher | null> {
        return this.mockFind({email: email});
    }

    async ofId(id: UserId): Promise<Teacher | null> {
        this.mockFind(id);
        return this.teacher;
    }

    async ofStudent(id: UserId, offset: number, limit: number): Promise<Array<Teacher>> {
        return Promise.resolve([]);
    }

    async save(teacher: Teacher): Promise<void> {
        this.mockSave(teacher);
    }

    returnOnSearch(teacher: Teacher) {
        this.teacher = teacher;
    }

    assertLastSavedCourseIs(expected: Teacher): void {
        const mock = this.mockSave.mock;
        const lastSavedCourse = mock.calls[mock.calls.length - 1][0] as Teacher;
        expect(lastSavedCourse).toBeInstanceOf(Teacher);
        expect(lastSavedCourse.toPrimitives()).toEqual(expected.toPrimitives());
    }
}