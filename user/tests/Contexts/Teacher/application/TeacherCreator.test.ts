import {TeacherRepositoryMock} from "../__mocks__/TeacherRepositoryMock";
import {TeacherCreator} from "../../../../src/Contexts/Teacher/application/TeacherCreator";
import EventBusMock from "../../Shared/__mocks__/EventBusMock";
import {TeacherCreatorRequestMother} from "./TeacherCreatorRequestMother";
import {TeacherMother} from "../domain/TeacherMother";

let repository: TeacherRepositoryMock;
let creator: TeacherCreator;

const eventBus = new EventBusMock();

beforeEach(() => {
    repository = new TeacherRepositoryMock();
    creator = new TeacherCreator(repository, eventBus);
});

it('should create a valid teacher', async () => {
    const request = TeacherCreatorRequestMother.random();
    const teacher = TeacherMother.fromRequest(request);
    await creator.run(request);

    repository.assertLastSavedCourseIs(teacher);
});