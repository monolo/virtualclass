import {TeacherRepository} from "../domain/TeacherRepository";
import {EventBus} from "../../Shared/domain/EventBus";
import {TeacherCreatorRequest} from "./TeacherCreatorRequest";
import {UserEmail} from "../../User/domain/value-object/UserEmail";
import {UserAlreadyExistsError} from "../../User/domain/Errors/UserAlreadyExistsError";
import {Uuid} from "../../Shared/domain/value-object/Uuid";
import {UserName} from "../../User/domain/value-object/UserName";
import {UserSurname} from "../../User/domain/value-object/UserSurname";
import {UserPassword} from "../../User/domain/value-object/UserPassword";
import {TeacherShortDescription} from "../domain/TeacherShortDescription";
import {TeacherFullDescription} from "../domain/TeacherFullDescription";
import {Teacher} from "../domain/Teacher";
import {UserId} from "../../User/domain/value-object/UserId";

export class TeacherCreator {
    private repository: TeacherRepository;
    private eventBus: EventBus;

    constructor(repository: TeacherRepository, eventBus: EventBus) {
        this.repository = repository;
        this.eventBus = eventBus;
    }

    async run(request: TeacherCreatorRequest): Promise<void> {
        let teacher = await this.repository.ofEmail(new UserEmail(request.email));
        if (teacher) {
            throw new UserAlreadyExistsError();
        }

        teacher = Teacher.create(
            (request.id) ? new UserId(request.id) : Uuid.random(),
            new UserName(request.name),
            new UserSurname(request.surname),
            new UserEmail(request.email),
            new UserPassword(request.password),
            new TeacherShortDescription(request.shortDescription),
            new TeacherFullDescription(request.fullDescription)
        );

        await this.repository.save(teacher);
        await this.eventBus.publish(teacher.pullDomainEvents());
    }
}