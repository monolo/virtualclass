import {UserId} from "../../../../src/Contexts/User/domain/value-object/UserId";
import {UserName} from "../../../../src/Contexts/User/domain/value-object/UserName";
import {UserSurname} from "../../../../src/Contexts/User/domain/value-object/UserSurname";
import {UserEmail} from "../../../../src/Contexts/User/domain/value-object/UserEmail";
import {UserPassword} from "../../../../src/Contexts/User/domain/value-object/UserPassword";
import {Teacher} from "../../../../src/Contexts/Teacher/domain/Teacher";
import {UserIdMother} from "../../User/domain/value-object/UserIdMother";
import {UserNameMother} from "../../User/domain/value-object/UserNameMother";
import {UserSurnameMother} from "../../User/domain/value-object/UserSurnameMother";
import {UserEmailMother} from "../../User/domain/value-object/UserEmailMother";
import {UserPasswordMother} from "../../User/domain/value-object/UserPasswordMother";
import {Student} from "../../../../src/Contexts/Student/domain/Student";
import {StudentCreatorRequest} from "../../../../src/Contexts/Student/application/StudentCreatorRequest";

export class StudentMother {
    static create(
        id: UserId,
        name: UserName,
        surname: UserSurname,
        email: UserEmail,
        password: UserPassword,
    ): Student {
        return new Student(id, name, surname, email, password, [Student.role])
    }

    static fromRequest(request: StudentCreatorRequest): Student {
        if(!request.id) throw new Error("UserId required");
        return this.create(
            UserIdMother.create(request.id),
            UserNameMother.create(request.name),
            UserSurnameMother.create(request.surname),
            UserEmailMother.create(request.email),
            UserPasswordMother.create(request.password)
        );
    }
}