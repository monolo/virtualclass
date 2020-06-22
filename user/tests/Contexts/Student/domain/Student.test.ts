import {StudentCreatorRequestMother} from "../application/StudentCreatorRequestMother";
import {StudentMother} from "./StudentMother";
import {Student} from "../../../../src/Contexts/Student/domain/Student";
import {UserRole} from "../../../../src/Contexts/User/domain/value-object/UserRole";
import {UserNameMother} from "../../User/domain/value-object/UserNameMother";
import {UserEmailMother} from "../../User/domain/value-object/UserEmailMother";
import {UserPasswordMother} from "../../User/domain/value-object/UserPasswordMother";
import {UserSurnameMother} from "../../User/domain/value-object/UserSurnameMother";
import {UserIdMother} from "../../User/domain/value-object/UserIdMother";
import {TeacherCreatorRequestMother} from "../../Teacher/application/TeacherCreatorRequestMother";
import {TeacherMother} from "../../Teacher/domain/TeacherMother";

describe('Student', () => {
    it('should return a new student instance', () => {
       const request = StudentCreatorRequestMother.random();

       const student = StudentMother.fromRequest(request);

       expect(student).toBeInstanceOf(Student);
       expect(student.id.value).toBe(request.id);
       expect(student.name.value).toBe(request.name);
       expect(student.surname.value).toBe(request.surname);
       expect(student.email.value).toBe(request.email);
       expect(student.password.value).toBe(request.password);
       expect(student.roles.map(role => role.value)).toContain(UserRole.STUDENT);
    });

   it('should student a UserCreatedDomainEvent after its creation', () => {
      const student = Student.create(
          UserIdMother.random(),
          UserNameMother.random(),
          UserSurnameMother.random(),
          UserEmailMother.random(),
          UserPasswordMother.random(),
      );

      const events = student.pullDomainEvents();

      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('user.created');
   });

   it('should add a pending teacher and check events', () => {
      const requestStudent = StudentCreatorRequestMother.random();
      const student = StudentMother.fromRequest(requestStudent);

      const requestTeacher = TeacherCreatorRequestMother.random();
      const teacher = TeacherMother.fromRequest(requestTeacher);

      student.requestTeacher(teacher);

      expect(student.teachersIdPending).toContain(teacher.id);

      const events = student.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('websocket.emit');
   });

   it('should add teacher and check events', () => {
      const requestStudent = StudentCreatorRequestMother.random();
      const student = StudentMother.fromRequest(requestStudent);

      const requestTeacher = TeacherCreatorRequestMother.random();
      const teacher = TeacherMother.fromRequest(requestTeacher);

      student.addTeacherIdPending(teacher);
      student.acceptTeacher(teacher);

      expect(student.teachersId).toContain(teacher.id);
      expect(teacher.studentsId).toContain(student.id);

      const events = student.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('websocket.emit');
   });

   it('should remove a teacher and check events', () => {
      const requestStudent = StudentCreatorRequestMother.random();
      const student = StudentMother.fromRequest(requestStudent);

      const requestTeacher = TeacherCreatorRequestMother.random();
      const teacher = TeacherMother.fromRequest(requestTeacher);

      student.addTeacherId(teacher);
      teacher.addStudentId(student);

      student.rejectTeacher(teacher);

      expect(student.teachersId).not.toContain(teacher.id);
      expect(teacher.studentsId).not.toContain(student.id);

      const events = student.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0].eventName).toBe('websocket.emit');
   });
});