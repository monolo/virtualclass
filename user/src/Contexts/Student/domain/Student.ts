import {User} from "../../User/domain/User";
import {UserId} from "../../User/domain/value-object/UserId";
import {UserName} from "../../User/domain/value-object/UserName";
import {UserSurname} from "../../User/domain/value-object/UserSurname";
import {UserPassword} from "../../User/domain/value-object/UserPassword";
import {UserRole} from "../../User/domain/value-object/UserRole";
import {Teacher} from "../../Teacher/domain/Teacher";
import {UserEmail} from "../../User/domain/value-object/UserEmail";
import {TeacherAlreadyPending} from "./Errors/TeacherAlreadyPending";
import {TeacherAlreadyAssigned} from "./Errors/TeacherAlreadyAssigned";
import {TeacherIsNotPending} from "./Errors/TeacherIsNotPending";
import {TeacherIsNotAssigned} from "./Errors/TeacherIsNotAssigned";
import {WebSocketDomainEvent} from "../../Shared/domain/WebSocketDomainEvent";

export class Student extends User {
    static role: UserRole = new UserRole(UserRole.STUDENT);
    readonly teachersId: Array<UserId> = []
    readonly teachersIdPending: Array<UserId> = []

    constructor(
        id: UserId,
        name: UserName,
        surname: UserSurname,
        email: UserEmail,
        password: UserPassword,
        roles: Array<UserRole>,
        teachersId: Array<UserId> = [],
        teachersIdPending: Array<UserId> = []
    ) {
        super(id, name, surname, email, password, roles);
        this.teachersId = teachersId;
        this.teachersIdPending = teachersIdPending;
    }

    static create(
        id: UserId,
        name: UserName,
        surname: UserSurname,
        email: UserEmail,
        password: UserPassword,
    ): Student {
        const student = new Student(id, name, surname, email, password, [this.role]);
        student.onCreated(student);
        return student;
    }

    public requestTeacher(teacher: Teacher) {
        if (this.teachersIdPending.includes(teacher.id)) {
            throw new TeacherAlreadyPending();
        }
        if (this.teachersId.includes(teacher.id)) {
            throw new TeacherAlreadyAssigned();
        }
        this.addTeacherIdPending(teacher);
        this.record(new WebSocketDomainEvent(
            this.id.value,
            `/teacher/${teacher.id.value}`,
            'requested',
            {
                studentId: this.id.value
            }
        ));
    }

    public acceptTeacher(teacher: Teacher) {
        if (!this.teachersIdPending.includes(teacher.id)) {
            throw new TeacherIsNotPending();
        }
        if (this.teachersId.includes(teacher.id)) {
            throw new TeacherAlreadyAssigned();
        }
        this.addTeacherId(teacher);
        teacher.addStudentId(this);
        this.record(new WebSocketDomainEvent(
            this.id.value,
            `/teacher/${teacher.id.value}`,
            'accepted',
            {
                studentId: this.id.value
            }
        ));
    }

    public rejectTeacher(teacher: Teacher) {
        const isPending = this.teachersIdPending.includes(teacher.id)
        const isAccepted = this.teachersId.includes(teacher.id)
        if (!isPending && !isAccepted) {
            if (!isPending)
                throw new TeacherIsNotPending();
            else
                throw new TeacherIsNotAssigned();
        }
        this.removeTeacherId(teacher);
        this.removeTeacherIdPending(teacher);
        teacher.removeStudentId(this);
        teacher.removeStudentIdPending(this);
        this.record(new WebSocketDomainEvent(
            this.id.value,
            `/teacher/${teacher.id.value}`,
            'rejected',
            {
                studentId: this.id.value
            }
        ));
    }

    public addTeacherIdPending(teacher: Teacher) {
        if (!this.teachersIdPending.includes(teacher.id))
            this.teachersIdPending.push(teacher.id);
    }

    public removeTeacherIdPending(teacher: Teacher) {
        const index = this.teachersIdPending.indexOf(teacher.id);
        if (index !== -1)
            this.teachersIdPending.splice(index, 1);
    }

    public addTeacherId(teacher: Teacher) {
        if (!this.teachersId.includes(teacher.id))
            this.teachersId.push(teacher.id);
        this.removeTeacherIdPending(teacher);
    }

    public removeTeacherId(teacher: Teacher) {
        const index = this.teachersId.indexOf(teacher.id);
        if (index !== -1)
            this.teachersId.splice(index, 1);
    }

    static fromPrimitives(plainData: {
        id: string;
        name: string;
        surname: string;
        email: string;
        password: string;
        roles: Array<string>
        teachersId: Array<string>
        teachersIdPending: Array<string>
    }): Student {
        return new Student(
            new UserId(plainData.id),
            new UserName(plainData.name),
            new UserSurname(plainData.surname),
            new UserEmail(plainData.email),
            new UserPassword(plainData.password),
            plainData.roles.map(role => new UserRole(role)),
            plainData.teachersId.map(teacherId => new UserId(teacherId)),
            plainData.teachersIdPending.map(teacherId => new UserId(teacherId))
        );
    }

    public toPrimitives(): any {
        return {
            ...super.toPrimitives(),
            teachersId: this.teachersId.map((teacherId => teacherId.value)),
            teachersIdPending: this.teachersIdPending.map(teacherId => teacherId.value)
        }
    }
}