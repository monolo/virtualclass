import {MongoUserRepository} from "../../../User/infrastructure/persistence/MongoUserRepository";
import {UserId} from "../../../User/domain/value-object/UserId";
import {UserEmail} from "../../../User/domain/value-object/UserEmail";
import {StudentRepository} from "../../domain/StudentRepository";
import {Student} from "../../domain/Student";

export class MongoStudentRepository extends MongoUserRepository implements StudentRepository {
    searchQuery = {
        roles: Student.role.value
    }

    public async ofEmail(email: UserEmail): Promise<Student | null> {
        const collection = await this.collection();
        const student = await collection.findOne({
            ...this.searchQuery,
            email: email.value
        });
        return student ? Student.fromPrimitives({...student, id: student._id}) : null;
    }

    public async ofId(id: UserId): Promise<Student | null> {
        const collection = await this.collection();
        const student = await collection.findOne({
            ...this.searchQuery,
            _id: id.value
        });
        return student ? Student.fromPrimitives({...student, id: student._id}) : null;
    }

    public async ofTeacher(id: UserId, offset: number = 0, limit: number = 8): Promise<Array<Student>> {
        if (limit > 50) limit = 50;
        const collection = await this.collection();
        const students = await collection
            .find({
                ...this.searchQuery,
                studentsId: id.value
            })
            .skip(offset)
            .limit(limit)
            .toArray();
        return students.length ? students.map(student => Student.fromPrimitives({...student, id: student._id})) : [];
    }

    public async save(student: Student): Promise<void> {
        await this.persist(student.id.value, student);
    }
}