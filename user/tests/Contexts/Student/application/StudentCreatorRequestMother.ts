import {TeacherCreatorRequest} from "../../../../src/Contexts/Teacher/application/TeacherCreatorRequest";
import {UserId} from "../../../../src/Contexts/User/domain/value-object/UserId";
import {UserName} from "../../../../src/Contexts/User/domain/value-object/UserName";
import {UserSurname} from "../../../../src/Contexts/User/domain/value-object/UserSurname";
import {UserEmail} from "../../../../src/Contexts/User/domain/value-object/UserEmail";
import {UserPassword} from "../../../../src/Contexts/User/domain/value-object/UserPassword";
import {UserIdMother} from "../../User/domain/value-object/UserIdMother";
import {UserNameMother} from "../../User/domain/value-object/UserNameMother";
import {UserSurnameMother} from "../../User/domain/value-object/UserSurnameMother";
import {UserEmailMother} from "../../User/domain/value-object/UserEmailMother";
import {UserPasswordMother} from "../../User/domain/value-object/UserPasswordMother";
import {StudentCreatorRequest} from "../../../../src/Contexts/Student/application/StudentCreatorRequest";

export class StudentCreatorRequestMother {
    static create(
        id: UserId,
        name: UserName,
        surname: UserSurname,
        email: UserEmail,
        password: UserPassword,
    ): StudentCreatorRequest {
        return {
            id: id.value,
            name: name.value,
            surname: surname.value,
            email: email.value,
            password: password.value,
        }
    }

    static random(): StudentCreatorRequest {
        return this.create(
            UserIdMother.random(),
            UserNameMother.random(),
            UserSurnameMother.random(),
            UserEmailMother.random(),
            UserPasswordMother.random()
        )
    }
}