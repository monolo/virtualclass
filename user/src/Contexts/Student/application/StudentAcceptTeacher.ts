import {StudentRepository} from "../domain/StudentRepository";
import {TeacherRepository} from "../../Teacher/domain/TeacherRepository";
import {UserId} from "../../User/domain/value-object/UserId";
import {EventBus} from "../../Shared/domain/EventBus";
import {StudentAcceptTeacherRequest} from "./StudentAcceptTeacherRequest";
import {UserDoesNotExistError} from "../../User/domain/Errors/UserDoesNotExistError";

export class StudentAcceptTeacher {
    private studentRepository: StudentRepository;
    private teacherRepository: TeacherRepository;
    private eventBus: EventBus;

    constructor(studentRepository: StudentRepository, teacherRepository: TeacherRepository, eventBus: EventBus) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.eventBus = eventBus;
    }

    async run(request: StudentAcceptTeacherRequest){
        let student = await this.studentRepository.ofId(new UserId(request.id));
        if(!student)
            throw new UserDoesNotExistError();
        let teacher = await this.teacherRepository.ofId(new UserId(request.teacherId));
        if(!teacher)
            throw new UserDoesNotExistError();

        student.acceptTeacher(teacher);
        await this.studentRepository.save(student);
        await this.teacherRepository.save(teacher);
        await this.eventBus.publish(student.pullDomainEvents());
    }
}