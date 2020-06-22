import {UserResponse} from "../../../User/application/Find/UserResponse";

export interface StudentResponse extends UserResponse {
    requested?: boolean;
    accepted?: boolean;
}