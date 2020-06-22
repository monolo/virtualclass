import EventBusMock from "../../Shared/__mocks__/EventBusMock";
import {StudentRepositoryMock} from "../__mocks__/StudentRepositoryMock";
import {StudentCreator} from "../../../../src/Contexts/Student/application/StudentCreator";
import {StudentCreatorRequestMother} from "./StudentCreatorRequestMother";
import {StudentMother} from "../domain/StudentMother";

let repository: StudentRepositoryMock;
let creator: StudentCreator;

const eventBus = new EventBusMock();

beforeEach(() => {
    repository = new StudentRepositoryMock();
    creator = new StudentCreator(repository, eventBus);
});

it('should create a valid student', async () => {
    const request = StudentCreatorRequestMother.random();
    const student = StudentMother.fromRequest(request);
    await creator.run(request);

    repository.assertLastSavedCourseIs(student);
});
