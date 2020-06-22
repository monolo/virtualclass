import {TeacherRepository} from "../../domain/TeacherRepository";
import {Teacher} from "../../domain/Teacher";
import {MongoUserRepository} from "../../../User/infrastructure/persistence/MongoUserRepository";
import {UserId} from "../../../User/domain/value-object/UserId";
import {UserEmail} from "../../../User/domain/value-object/UserEmail";

export class MongoTeacherRepository extends MongoUserRepository implements TeacherRepository {
    searchQuery = {
        roles: Teacher.role.value
    }

    public async ofEmail(email: UserEmail): Promise<Teacher | null> {
        const collection = await this.collection();
        const teacher = await collection.findOne({
            ...this.searchQuery,
            email: email.value
        });
        return teacher ? Teacher.fromPrimitives({...teacher, id: teacher._id}) : null;
    }

    public async ofId(id: UserId): Promise<Teacher | null> {
        const collection = await this.collection();
        const teacher = await collection.findOne({
            ...this.searchQuery,
            _id: id.value
        });
        return teacher ? Teacher.fromPrimitives({...teacher, id: teacher._id}) : null;
    }

    public async ofStudent(id: UserId, offset: number = 0, limit: number = 8): Promise<Array<Teacher>> {
        if (limit > 50) limit = 50;
        const collection = await this.collection();
        const teachers = await collection
            .find({
                ...this.searchQuery,
                studentsId: id.value
            })
            .skip(offset)
            .limit(limit)
            .toArray();
        return teachers.length ? teachers.map(teacher => Teacher.fromPrimitives({...teacher, id: teacher._id})) : [];
    }

    public async save(teacher: Teacher): Promise<void> {
        await this.persist(teacher.id.value, teacher);
    }
}