import {TeacherCreatorRequestMother} from "../application/TeacherCreatorRequestMother";
import {TeacherMother} from "./TeacherMother";
import {UserRole} from "../../../../src/Contexts/User/domain/value-object/UserRole";
import {Teacher} from "../../../../src/Contexts/Teacher/domain/Teacher";
import {UserIdMother} from "../../User/domain/value-object/UserIdMother";
import {UserNameMother} from "../../User/domain/value-object/UserNameMother";
import {UserSurnameMother} from "../../User/domain/value-object/UserSurnameMother";
import {UserEmailMother} from "../../User/domain/value-object/UserEmailMother";
import {UserPasswordMother} from "../../User/domain/value-object/UserPasswordMother";
import {TeacherShortDescriptionMother} from "./TeacherShortDescriptionMother";
import {TeacherFullDescriptionMother} from "./TeacherFullDescriptionMother";
import {StudentCreatorRequestMother} from "../../Student/application/StudentCreatorRequestMother";
import {StudentMother} from "../../Student/domain/StudentMother";

describe('Teacher', () => {
    it('should return a new teacher instance', () => {
       const request = TeacherCreatorRequestMother.random();

       const teacher = TeacherMother.fromRequest(request);

       expect(teacher).toBeInstanceOf(Teacher);
       expect(teacher.id.value).toBe(request.id);
       expect(teacher.name.value).toBe(request.name);
       expect(teacher.surname.value).toBe(request.surname);
       expect(teacher.email.value).toBe(request.email);
       expect(teacher.password.value).toBe(request.password);
       expect(teacher.shortDescription.value).toBe(request.shortDescription);
       expect(teacher.fullDescription.value).toBe(request.fullDescription);
       expect(teacher.roles.map(role => role.value)).toContain(UserRole.TEACHER);
    });

   it('should teachear a UserCreatedDomainEvent after its creation', () => {
      const teacher = Teacher.create(
          UserIdMother.random(),
          UserNameMother.random(),
          UserSurnameMother.random(),
          UserEmailMother.random(),
          UserPasswordMother.random(),
          TeacherShortDescriptionMother.random(),
          TeacherFullDescriptionMother.random(),
      );

      const events = teacher.pullDomainEvents();

      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('user.created');
   });

   it('should add a pending student and check events', () => {
      const requestTeacher = TeacherCreatorRequestMother.random();
      const teacher = TeacherMother.fromRequest(requestTeacher);

      const requestStudent = StudentCreatorRequestMother.random();
      const student = StudentMother.fromRequest(requestStudent);

      teacher.requestStudent(student);

      expect(teacher.studentsIdPending).toContain(student.id);

      const events = teacher.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('websocket.emit');
   });

   it('should add student and check events', () => {
      const requestTeacher = TeacherCreatorRequestMother.random();
      const teacher = TeacherMother.fromRequest(requestTeacher);

      const requestStudent = StudentCreatorRequestMother.random();
      const student = StudentMother.fromRequest(requestStudent);

      teacher.addStudentIdPending(student);
      teacher.acceptStudent(student);

      expect(teacher.studentsId).toContain(student.id);
      expect(student.teachersId).toContain(teacher.id);

      const events = teacher.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('websocket.emit');
   });

   it('should remove a student and check events', () => {
      const requestTeacher = TeacherCreatorRequestMother.random();
      const teacher = TeacherMother.fromRequest(requestTeacher);

      const requestStudent = StudentCreatorRequestMother.random();
      const student = StudentMother.fromRequest(requestStudent);

      teacher.addStudentId(student);
      student.addTeacherId(teacher);

      teacher.rejectStudent(student);

      expect(teacher.studentsId).not.toContain(student.id);
      expect(student.teachersId).not.toContain(teacher.id);

      const events = teacher.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('websocket.emit');
   });
});