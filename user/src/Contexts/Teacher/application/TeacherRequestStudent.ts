import {TeacherRepository} from "../../Teacher/domain/TeacherRepository";
import {UserId} from "../../User/domain/value-object/UserId";
import {EventBus} from "../../Shared/domain/EventBus";
import {UserDoesNotExistError} from "../../User/domain/Errors/UserDoesNotExistError";
import {StudentRepository} from "../../Student/domain/StudentRepository";
import {TeacherRequestStudentRequest} from "./TeacherRequestStudentRequest";

export class StudentRequestTeacher {
    private teacherRepository: TeacherRepository;
    private studentRepository: StudentRepository;
    private eventBus: EventBus;

    constructor(teacherRepository: TeacherRepository, studentRepository: StudentRepository, eventBus: EventBus) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.eventBus = eventBus;
    }

    async run(request: TeacherRequestStudentRequest){
        let teacher = await this.teacherRepository.ofId(new UserId(request.id));
        if(!teacher)
            throw new UserDoesNotExistError();
        let student = await this.studentRepository.ofId(new UserId(request.studentId));
        if(!student)
            throw new UserDoesNotExistError();

        teacher.requestStudent(student);
        await this.teacherRepository.save(teacher);
        await this.eventBus.publish(teacher.pullDomainEvents());
    }
}