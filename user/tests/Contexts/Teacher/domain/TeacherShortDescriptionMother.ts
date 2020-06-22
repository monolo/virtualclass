import {TeacherShortDescription} from "../../../../src/Contexts/Teacher/domain/TeacherShortDescription";
import {WordMother} from "../../Shared/domain/WordMother";

export class TeacherShortDescriptionMother {
    static create(value: string): TeacherShortDescription {
        return new TeacherShortDescription(value);
    }

    static random(): TeacherShortDescription {
        return this.create(WordMother.random());
    }
}
