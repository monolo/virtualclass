import {UserId} from "../../../../src/Contexts/User/domain/value-object/UserId";
import {UserName} from "../../../../src/Contexts/User/domain/value-object/UserName";
import {UserSurname} from "../../../../src/Contexts/User/domain/value-object/UserSurname";
import {UserEmail} from "../../../../src/Contexts/User/domain/value-object/UserEmail";
import {UserPassword} from "../../../../src/Contexts/User/domain/value-object/UserPassword";
import {UserRole} from "../../../../src/Contexts/User/domain/value-object/UserRole";
import {TeacherShortDescription} from "../../../../src/Contexts/Teacher/domain/TeacherShortDescription";
import {TeacherFullDescription} from "../../../../src/Contexts/Teacher/domain/TeacherFullDescription";
import {Teacher} from "../../../../src/Contexts/Teacher/domain/Teacher";
import {TeacherCreatorRequest} from "../../../../src/Contexts/Teacher/application/TeacherCreatorRequest";
import {UserIdMother} from "../../User/domain/value-object/UserIdMother";
import {UserNameMother} from "../../User/domain/value-object/UserNameMother";
import {UserSurnameMother} from "../../User/domain/value-object/UserSurnameMother";
import {UserEmailMother} from "../../User/domain/value-object/UserEmailMother";
import {UserPasswordMother} from "../../User/domain/value-object/UserPasswordMother";
import {TeacherShortDescriptionMother} from "./TeacherShortDescriptionMother";
import {TeacherFullDescriptionMother} from "./TeacherFullDescriptionMother";

export class TeacherMother {
    static create(
        id: UserId,
        name: UserName,
        surname: UserSurname,
        email: UserEmail,
        password: UserPassword,
        shortDescription: TeacherShortDescription,
        fullDescription: TeacherFullDescription,
    ): Teacher {
        return new Teacher(id, name, surname, email, password, [Teacher.role], shortDescription, fullDescription)
    }

    static fromRequest(request: TeacherCreatorRequest): Teacher {
        if(!request.id) throw new Error('UserId required');
        return this.create(
            UserIdMother.create(request.id),
            UserNameMother.create(request.name),
            UserSurnameMother.create(request.surname),
            UserEmailMother.create(request.email),
            UserPasswordMother.create(request.password),
            TeacherShortDescriptionMother.create(request.shortDescription),
            TeacherFullDescriptionMother.create(request.fullDescription),
        );
    }
}