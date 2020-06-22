import {WordMother} from "../../Shared/domain/WordMother";
import {TeacherFullDescription} from "../../../../src/Contexts/Teacher/domain/TeacherFullDescription";

export class TeacherFullDescriptionMother {
    static create(value: string): TeacherFullDescription {
        return new TeacherFullDescription(value);
    }

    static random(): TeacherFullDescription {
        return this.create(WordMother.random());
    }
}
