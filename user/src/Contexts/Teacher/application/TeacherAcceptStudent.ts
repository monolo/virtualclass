import {TeacherRepository} from "../../Teacher/domain/TeacherRepository";
import {UserId} from "../../User/domain/value-object/UserId";
import {EventBus} from "../../Shared/domain/EventBus";
import {UserDoesNotExistError} from "../../User/domain/Errors/UserDoesNotExistError";
import {StudentRepository} from "../../Student/domain/StudentRepository";
import {TeacherAcceptStudentRequest} from "./TeacherAcceptStudentRequest";

export class TeacherAcceptStudent {
    private teacherRepository: TeacherRepository;
    private studentRepository: StudentRepository;
    private eventBus: EventBus;

    constructor(teacherRepository: TeacherRepository, studentRepository: StudentRepository, eventBus: EventBus) {
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
        this.eventBus = eventBus;
    }

    async run(request: TeacherAcceptStudentRequest){
        let teacher = await this.teacherRepository.ofId(new UserId(request.id));
        if (!teacher)
            throw new UserDoesNotExistError();
        let student = await this.studentRepository.ofId(new UserId(request.studentId));
        if(!student) {
            throw new UserDoesNotExistError();
        }

        teacher.acceptStudent(student);
        await this.teacherRepository.save(teacher);
        await this.studentRepository.save(student);
        await this.eventBus.publish(teacher.pullDomainEvents());
    }
}