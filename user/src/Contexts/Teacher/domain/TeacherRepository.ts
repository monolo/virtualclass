import {Teacher} from "./Teacher";
import {UserId} from "../../User/domain/value-object/UserId";
import {UserEmail} from "../../User/domain/value-object/UserEmail";

export interface TeacherRepository {
    ofId(id: UserId): Promise<Teacher|null>
    ofEmail(email: UserEmail): Promise<Teacher|null>
    ofStudent(id: UserId, offset: number, limit: number): Promise<Array<Teacher>>
    save(teacher: Teacher): Promise<void>
}