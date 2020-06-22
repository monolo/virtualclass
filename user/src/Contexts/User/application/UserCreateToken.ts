import {UserCreateTokenRequest} from "./UserCreateTokenRequest";
import jwt from 'jsonwebtoken';
import {UserRepository} from "../domain/UserRepository";
import {UserEmail} from "../domain/value-object/UserEmail";
import {UserDoesNotExistError} from "../domain/Errors/UserDoesNotExistError";
import {UserInvalidPasswordError} from "../domain/Errors/UserInvalidPasswordError";
import {UserToken} from "../domain/UserToken";
import config from "../../../app/config/config";

export class UserCreateToken {
    private repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    async run(request: UserCreateTokenRequest): Promise<Object> {
        const user = await this.repository.ofEmail(new UserEmail(request.email));
        if(!user) {
            throw new UserDoesNotExistError();
        }

        if(user.password.value !== request.password){
            throw new UserInvalidPasswordError();
        }

        const userToken: UserToken = {
            id: user.id.value,
            name: user.name.value,
            surname: user.surname.value,
            email: user.email.value,
            roles: user.roles.map(rol => rol.value)
        }
        return {
            id: user.id.value,
            name: user.name.value,
            surname: user.surname.value,
            email: user.email.value,
            roles: user.roles.map(rol => rol.value),
            token: jwt.sign(userToken, config.get('jwtSecret'), {expiresIn: '7d', algorithm: "HS512"})
        }
    }
}