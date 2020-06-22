import {Student} from "./Student";
import {UserId} from "../../User/domain/value-object/UserId";
import {UserEmail} from "../../User/domain/value-object/UserEmail";

export interface StudentRepository {
    ofId(id: UserId): Promise<Student|null>
    ofEmail(email: UserEmail): Promise<Student|null>
    ofTeacher(id: UserId, offset: number, limit: number): Promise<Array<Student>>
    save(teacher: Student): Promise<void>
}