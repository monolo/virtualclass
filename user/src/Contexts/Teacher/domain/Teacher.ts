import {User} from "../../User/domain/User";
import {UserId} from "../../User/domain/value-object/UserId";
import {UserName} from "../../User/domain/value-object/UserName";
import {UserSurname} from "../../User/domain/value-object/UserSurname";
import {UserPassword} from "../../User/domain/value-object/UserPassword";
import {UserRole} from "../../User/domain/value-object/UserRole";
import {UserEmail} from "../../User/domain/value-object/UserEmail";
import {TeacherShortDescription} from "./TeacherShortDescription";
import {TeacherFullDescription} from "./TeacherFullDescription";
import {Student} from "../../Student/domain/Student";
import {StudentAlreadyPending} from "./Errors/StudentAlreadyPending";
import {StudentAlreadyAssigned} from "./Errors/StudentAlreadyAssigned";
import {StudentIsNotPending} from "./Errors/StudentIsNotPending";
import {WebSocketDomainEvent} from "../../Shared/domain/WebSocketDomainEvent";
import {TeacherIsNotPending} from "../../Student/domain/Errors/TeacherIsNotPending";
import {TeacherIsNotAssigned} from "../../Student/domain/Errors/TeacherIsNotAssigned";
import {StudentIsNotAssigned} from "./Errors/StudentIsNotAssigned";
import teacher from "../../../app/routes/teacher";

export class Teacher extends User {
    static role: UserRole = new UserRole(UserRole.TEACHER);
    readonly shortDescription: TeacherShortDescription;
    readonly fullDescription: TeacherFullDescription;
    readonly studentsId: Array<UserId> = []
    readonly studentsIdPending: Array<UserId> = []

    constructor(
        id: UserId,
        name: UserName,
        surname: UserSurname,
        email: UserEmail,
        password: UserPassword,
        roles: Array<UserRole>,
        shortDescription: TeacherShortDescription,
        fullDescription: TeacherFullDescription,
        studentsId: Array<UserId> = [],
        studentsIdPending: Array<UserId> = []
    ) {
        super(id, name, surname, email, password, roles);
        this.shortDescription = shortDescription
        this.fullDescription = fullDescription
        this.studentsId = studentsId
        this.studentsIdPending = studentsIdPending
    }

    static create(
        id: UserId,
        name: UserName,
        surname: UserSurname,
        email: UserEmail,
        password: UserPassword,
        shortDescription: TeacherShortDescription,
        fullDescription: TeacherFullDescription,
    ): Teacher {
        const student = new Teacher(id, name, surname, email, password, [this.role], shortDescription, fullDescription);
        student.onCreated(student);
        return student;
    }

    public requestStudent(student: Student) {
        if (this.studentsIdPending.includes(student.id)) {
            throw new StudentAlreadyPending();
        }
        if (this.studentsId.includes(student.id)) {
            throw new StudentAlreadyAssigned();
        }
        this.addStudentIdPending(student);
        this.record(new WebSocketDomainEvent(
            this.id.value,
            `/student/${student.id.value}`,
            'requested',
            {
                teacherId: this.id.value
            }
        ));
    }

    public acceptStudent(student: Student) {
        if (!this.studentsIdPending.includes(student.id)) {
            throw new StudentIsNotPending();
        }
        if (this.studentsId.includes(student.id)) {
            throw new StudentAlreadyAssigned();
        }
        this.addStudentId(student);
        student.addTeacherId(this);
        this.record(new WebSocketDomainEvent(
            this.id.value,
            `/student/${student.id.value}`,
            'accepted',
            {
                teacherId: this.id.value
            }
        ));
    }

    public rejectStudent(student: Student) {
        const isPending = this.studentsIdPending.includes(student.id)
        const isAccepted = this.studentsId.includes(student.id)
        if (!isPending && !isAccepted) {
            if (!isPending)
                throw new StudentIsNotPending();
            else
                throw new StudentIsNotAssigned();
        }
        this.removeStudentId(student);
        this.removeStudentIdPending(student);
        student.removeTeacherId(this);
        student.removeTeacherIdPending(this);
        this.record(new WebSocketDomainEvent(
            this.id.value,
            `/student/${student.id.value}`,
            'rejected',
            {
                teacherId: this.id.value
            }
        ));
    }

    public addStudentIdPending(student: Student) {
        if (!this.studentsIdPending.includes(student.id))
            this.studentsIdPending.push(student.id);
    }

    public removeStudentIdPending(student: Student) {
        const index = this.studentsIdPending.indexOf(student.id);
        if (index !== -1)
            this.studentsIdPending.splice(index, 1);
    }

    public addStudentId(student: Student) {
        if (!this.studentsId.includes(student.id))
            this.studentsId.push(student.id);
        this.removeStudentIdPending(student);
    }

    public removeStudentId(student: Student) {
        const index = this.studentsId.indexOf(student.id);
        if (index !== -1)
            this.studentsId.splice(index, 1);
    }

    static fromPrimitives(plainData: {
        id: string;
        name: string;
        surname: string;
        email: string;
        password: string;
        roles: Array<string>
        shortDescription: string,
        fullDescription: string,
        studentsId: Array<string>
        studentsIdPending: Array<string>
    }): Teacher {
        return new Teacher(
            new UserId(plainData.id),
            new UserName(plainData.name),
            new UserSurname(plainData.surname),
            new UserEmail(plainData.email),
            new UserPassword(plainData.password),
            plainData.roles.map(role => new UserRole(role)),
            new TeacherShortDescription(plainData.shortDescription),
            new TeacherFullDescription(plainData.fullDescription),
            plainData.studentsId.map(studentId => new UserId(studentId)),
            plainData.studentsIdPending.map(studentId => new UserId(studentId))
        );
    }

    public toPrimitives(): any {
        return {
            ...super.toPrimitives(),
            shortDescription: this.shortDescription.value,
            fullDescription: this.fullDescription.value,
            studentsId: this.studentsId.map((studentId => studentId.value)),
            studentsIdPending: this.studentsIdPending.map((studentId => studentId.value))
        }
    }
}