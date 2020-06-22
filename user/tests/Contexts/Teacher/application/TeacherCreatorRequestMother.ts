import {TeacherCreatorRequest} from "../../../../src/Contexts/Teacher/application/TeacherCreatorRequest";
import {UserId} from "../../../../src/Contexts/User/domain/value-object/UserId";
import {UserName} from "../../../../src/Contexts/User/domain/value-object/UserName";
import {UserSurname} from "../../../../src/Contexts/User/domain/value-object/UserSurname";
import {UserEmail} from "../../../../src/Contexts/User/domain/value-object/UserEmail";
import {UserPassword} from "../../../../src/Contexts/User/domain/value-object/UserPassword";
import {TeacherShortDescription} from "../../../../src/Contexts/Teacher/domain/TeacherShortDescription";
import {TeacherFullDescription} from "../../../../src/Contexts/Teacher/domain/TeacherFullDescription";
import {UserIdMother} from "../../User/domain/value-object/UserIdMother";
import {UserNameMother} from "../../User/domain/value-object/UserNameMother";
import {UserSurnameMother} from "../../User/domain/value-object/UserSurnameMother";
import {UserEmailMother} from "../../User/domain/value-object/UserEmailMother";
import {UserPasswordMother} from "../../User/domain/value-object/UserPasswordMother";
import {TeacherShortDescriptionMother} from "../domain/TeacherShortDescriptionMother";
import {TeacherFullDescriptionMother} from "../domain/TeacherFullDescriptionMother";

export class TeacherCreatorRequestMother {
    static create(
        id: UserId,
        name: UserName,
        surname: UserSurname,
        email: UserEmail,
        password: UserPassword,
        shortDescription: TeacherShortDescription,
        fullDescription: TeacherFullDescription
    ): TeacherCreatorRequest {
        return {
            id: id.value,
            name: name.value,
            surname: surname.value,
            email: email.value,
            password: password.value,
            shortDescription: shortDescription.value,
            fullDescription: fullDescription.value
        }
    }

    static random(): TeacherCreatorRequest {
        return this.create(
            UserIdMother.random(),
            UserNameMother.random(),
            UserSurnameMother.random(),
            UserEmailMother.random(),
            UserPasswordMother.random(),
            TeacherShortDescriptionMother.random(),
            TeacherFullDescriptionMother.random()
        )
    }
}