import {Express, Request} from "express";
import {TeacherCreatorRequest} from "../../Contexts/Teacher/application/TeacherCreatorRequest";
import container from "../config/dependency-injection";
import httpStatus from "http-status";
import {InvalidArgumentError} from "../../Contexts/Shared/domain/value-object/InvalidArgumentError";
import CheckTokenExpress from "../utils/CheckTokenExpress";
import {UserAlreadyExistsError} from "../../Contexts/User/domain/Errors/UserAlreadyExistsError";

export default (app: Express) => {
    app.post('/api/user/register/teacher', async (req, res, next) => {
        const fieldsRequired = ['id', 'name', 'surname', 'email', 'password', 'shortDescription', 'fullDescription'];
        const isRequestValid = !fieldsRequired.some(field => {
            if (!req.body[field]) {
                res.status(httpStatus.BAD_REQUEST).send({error: `Field ${field} required`});
                return true;
            }
        });
        if (!isRequestValid) return;

        const teacherCreatorRequest: TeacherCreatorRequest = {
            id: req.body.id,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password,
            shortDescription: req.body.shortDescription,
            fullDescription: req.body.fullDescription
        }
        try {
            const teacherCreator = container.get('Teacher.TeacherCreator');
            await teacherCreator.run(teacherCreatorRequest);
            res.status(httpStatus.CREATED).send();
        } catch (error) {
            if (error instanceof InvalidArgumentError ||
                error instanceof UserAlreadyExistsError
            )
                res.status(httpStatus.BAD_REQUEST).json({error: error.message});
            else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
                console.log(error);
            }
        }
    });

    app.post('/teacher/:id/request', CheckTokenExpress, (req: Request, res) => {
        console.log(req.user);
        console.log(req.params);
        res.status(httpStatus.OK).send();
    });
}