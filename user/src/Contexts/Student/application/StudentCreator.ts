import {StudentRepository} from "../domain/StudentRepository";
import {EventBus} from "../../Shared/domain/EventBus";
import {StudentCreatorRequest} from "./StudentCreatorRequest";
import {Student} from "../domain/Student";
import {Uuid} from "../../Shared/domain/value-object/Uuid";
import {UserName} from "../../User/domain/value-object/UserName";
import {UserSurname} from "../../User/domain/value-object/UserSurname";
import {UserPassword} from "../../User/domain/value-object/UserPassword";
import {UserEmail} from "../../User/domain/value-object/UserEmail";
import {UserAlreadyExistsError} from "../../User/domain/Errors/UserAlreadyExistsError";
import {UserId} from "../../User/domain/value-object/UserId";

export class StudentCreator{
    private repository: StudentRepository;
    private eventBus: EventBus;

    constructor(repository: StudentRepository, eventBus: EventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: StudentCreatorRequest): Promise<void> {
        let student = await this.repository.ofEmail(new UserEmail(request.email));
        if (student) {
            throw new UserAlreadyExistsError();
        }

        student = Student.create(
            (request.id) ? new UserId(request.id) : Uuid.random(),
            new UserName(request.name),
            new UserSurname(request.surname),
            new UserEmail(request.email),
            new UserPassword(request.password)
        );

        await this.repository.save(student);
        await this.eventBus.publish(student.pullDomainEvents());
    }
}