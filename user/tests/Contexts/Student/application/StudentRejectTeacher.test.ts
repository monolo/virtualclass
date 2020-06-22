import EventBusMock from "../../Shared/__mocks__/EventBusMock";
import {StudentRepositoryMock} from "../__mocks__/StudentRepositoryMock";
import {StudentCreatorRequestMother} from "./StudentCreatorRequestMother";
import {StudentMother} from "../domain/StudentMother";
import {TeacherRepositoryMock} from "../../Teacher/__mocks__/TeacherRepositoryMock";
import {TeacherCreatorRequestMother} from "../../Teacher/application/TeacherCreatorRequestMother";
import {TeacherMother} from "../../Teacher/domain/TeacherMother";
import {UserIdMother} from "../../User/domain/value-object/UserIdMother";
import {UserDoesNotExistError} from "../../../../src/Contexts/User/domain/Errors/UserDoesNotExistError";
import {StudentRejectTeacher} from "../../../../src/Contexts/Student/application/StudentRejectTeacher";

let repositoryStudent: StudentRepositoryMock;
let repositoryTeacher: TeacherRepositoryMock;
let studentRejectTeacher: StudentRejectTeacher;

const eventBus = new EventBusMock();

beforeEach(async () => {
    repositoryStudent = new StudentRepositoryMock();
    repositoryTeacher = new TeacherRepositoryMock();
    studentRejectTeacher = new StudentRejectTeacher(repositoryStudent, repositoryTeacher, eventBus);
});

it('should reject a valid teacher', async () => {
    const requestStudent = StudentCreatorRequestMother.random();
    const student = StudentMother.fromRequest(requestStudent);

    const requestTeacher = TeacherCreatorRequestMother.random();
    const teacher = TeacherMother.fromRequest(requestTeacher);

    student.addTeacherId(teacher);
    repositoryStudent.returnOnSearch(student);
    repositoryTeacher.returnOnSearch(teacher);

    await studentRejectTeacher.run({id: student.id.value, teacherId: teacher.id.value});

    repositoryStudent.assertOfId();

    const student2 = StudentMother.fromRequest(requestStudent);
    repositoryStudent.assertLastSavedCourseIs(student2);
});

it('should throw an exception when student does not exists', async () => {
    await expect(
        studentRejectTeacher.run({id: UserIdMother.random().value, teacherId: UserIdMother.random().value})
    ).rejects.toBeInstanceOf(UserDoesNotExistError);
});

it('should throw an exception when teacher does not exists', async () => {
    const requestStudent = StudentCreatorRequestMother.random();
    let student = StudentMother.fromRequest(requestStudent);
    await repositoryStudent.save(student);

    await expect(
        studentRejectTeacher.run({id: student.id.value, teacherId: UserIdMother.random().value})
    ).rejects.toBeInstanceOf(UserDoesNotExistError);
});