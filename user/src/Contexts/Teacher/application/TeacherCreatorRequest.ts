import {UserCreatorRequest} from "../../User/application/UserCreatorRequest";

export interface TeacherCreatorRequest extends UserCreatorRequest {
    shortDescription: string,
    fullDescription: string,
}