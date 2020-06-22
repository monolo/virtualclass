import {UserResponse} from "./UserResponse";

export type UsersByResponse = {
    users: Array<UserResponse>;
    total: number;
}