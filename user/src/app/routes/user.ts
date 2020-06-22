import {Express} from "express";
import container from "../config/dependency-injection";
import httpStatus from "http-status";
import {UserCreateTokenRequest} from "../../Contexts/User/application/UserCreateTokenRequest";
import {InvalidArgumentError} from "../../Contexts/Shared/domain/value-object/InvalidArgumentError";
import {UserDoesNotExistError} from "../../Contexts/User/domain/Errors/UserDoesNotExistError";
import {UserInvalidPasswordError} from "../../Contexts/User/domain/Errors/UserInvalidPasswordError";
import CheckTokenExpress from "../utils/CheckTokenExpress";
import {UserResponse} from "../../Contexts/User/application/Find/UserResponse";
import {UsersLessMeByRequest} from "../../Contexts/User/application/Find/UsersLessMeByRequest";
import {UsersByResponse} from "../../Contexts/User/application/Find/UsersByResponse";

export default (app: Express) => {
    app.post('/api/user/login', async (req, res, next) => {
        const fieldsRequired = ['email', 'password'];
        const isRequestValid = !fieldsRequired.some(field => {
            if (!req.body[field]) {
                res.status(httpStatus.UNAUTHORIZED).json({error: `Field ${field} required`});
                return true;
            }
        });
        if (!isRequestValid) return;

        const userCreateTokenRequest: UserCreateTokenRequest = {
            email: req.body.email,
            password: req.body.password
        }
        const userCreateToken = container.get('User.UserCreateToken');
        try {
            const user = await userCreateToken.run(userCreateTokenRequest);
            res.status(httpStatus.OK).json(user);
        } catch (e) {
            if (e instanceof InvalidArgumentError ||
                e instanceof UserDoesNotExistError ||
                e instanceof UserInvalidPasswordError
            ) {
                res.status(httpStatus.UNAUTHORIZED).json({error: e.message});
            } else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
            }
        }
    });

    app.get('/api/user/users', CheckTokenExpress, async (req, res) => {
        const fieldsRequired = ['offset', 'limit'];
        const isRequestValid = !fieldsRequired.some(field => {
            if (!req.query[field]) {
                res.status(httpStatus.UNAUTHORIZED).json({error: `Field ${field} required`});
                return true;
            }
        });
        if (!isRequestValid) return;

        // @ts-ignore
        const offset = parseInt(req.query.offset);

        // @ts-ignore
        const limit = parseInt(req.query.limit);
        const usersLessMeByRequest: UsersLessMeByRequest = {
            id: req.user.id,
            offset: offset,
            limit: limit
        }
        const usersLessMeByFinder = container.get('User.Find.UsersLessMeBy');
        try {
            const response:UsersByResponse = await usersLessMeByFinder.run(usersLessMeByRequest);
            res.status(httpStatus.OK).json(response);
        } catch (e) {
            if (e instanceof InvalidArgumentError ||
                e instanceof UserDoesNotExistError ||
                e instanceof UserInvalidPasswordError
            ) {
                res.status(httpStatus.UNAUTHORIZED).json({error: e.message});
            } else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
            }
        }
    });

    app.get('/api/user/:id', CheckTokenExpress, async (req, res) => {
        const userFinder = container.get('User.Find.User');
        try {
            const user:UserResponse = await userFinder.run(req.params.id);
            res.status(httpStatus.OK).json(user);
        } catch (e) {
            if (e instanceof InvalidArgumentError ||
                e instanceof UserDoesNotExistError ||
                e instanceof UserInvalidPasswordError
            ) {
                res.status(httpStatus.UNAUTHORIZED).json({error: e.message});
            } else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
            }
        }
    });
}