import {UserRepository} from "../../domain/UserRepository";
import {InvalidArgumentError} from "../../../Shared/domain/value-object/InvalidArgumentError";
import {UsersLessMeByRequest} from "./UsersLessMeByRequest";
import {UsersByResponse} from "./UsersByResponse";
import {UserId} from "../../domain/value-object/UserId";

export class UsersLessMeByFinder {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async run(request: UsersLessMeByRequest): Promise<UsersByResponse>{
        if(request.limit > 50){
            throw new InvalidArgumentError('The limit cannot exceed 50');
        }
        const users = await this.userRepository.getLessMeBy(new UserId(request.id), request.offset, request.limit);
        const countAll = await this.userRepository.countAll();
        return {
            total: countAll-1,
            users: users.map(user => {
                return {
                    id: user.id.value,
                    name: user.name.value,
                    surname: user.surname.value
                }
            })
        };
    }
}