import {UserRepository} from "../../domain/UserRepository";
import {UserDoesNotExistError} from "../../domain/Errors/UserDoesNotExistError";
import {UserResponse} from "./UserResponse";
import {UserId} from "../../domain/value-object/UserId";

export class UserFinder {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async run(id: string): Promise<UserResponse | null>{
        let user = await this.userRepository.ofId(new UserId(id));
        if(!user){
            throw new UserDoesNotExistError();
        }
        return {
            id: user.id.value,
            name: user.name.value,
            surname: user.surname.value
        }
    }
}