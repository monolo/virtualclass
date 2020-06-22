import {UserEmail} from "../../../../src/Contexts/User/domain/value-object/UserEmail";
import {UserId} from "../../../../src/Contexts/User/domain/value-object/UserId";
import {StudentRepository} from "../../../../src/Contexts/Student/domain/StudentRepository";
import {Student} from "../../../../src/Contexts/Student/domain/Student";

export class StudentRepositoryMock implements StudentRepository {
    private mockSave = jest.fn();
    private mockFind = jest.fn();
    private student: Student | null = null;

    async ofEmail(email: UserEmail): Promise<Student | null> {
        return this.mockFind({email: email});
    }

    async ofId(id: UserId): Promise<Student | null> {
        this.mockFind(id);
        return this.student;
    }

    async ofTeacher(id: UserId, offset: number, limit: number): Promise<Array<Student>> {
        return Promise.resolve([]);
    }

    async save(student: Student): Promise<void> {
        this.mockSave(student);
    }

    returnOnSearch(student: Student) {
        this.student = student;
    }

    assertOfId() {
        expect(this.mockFind).toHaveBeenCalledTimes(1);
    }

    assertLastSavedCourseIs(expected: Student): void {
        const mock = this.mockSave.mock;
        const lastSavedCourse = mock.calls[mock.calls.length - 1][0] as Student;
        expect(lastSavedCourse).toBeInstanceOf(Student);
        expect(lastSavedCourse.toPrimitives()).toEqual(expected.toPrimitives());
    }
}