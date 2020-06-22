import {Express, Request} from "express";
import {TeacherCreatorRequest} from "../../Contexts/Teacher/application/TeacherCreatorRequest";
import container from "../config/dependency-injection";
import httpStatus from "http-status";
import {InvalidArgumentError} from "../../Contexts/Shared/domain/value-object/InvalidArgumentError";
import CheckTokenExpress from "../utils/CheckTokenExpress";
import {UserAlreadyExistsError} from "../../Contexts/User/domain/Errors/UserAlreadyExistsError";
import {StudentCreatorRequest} from "../../Contexts/Student/application/StudentCreatorRequest";

export default (app: Express) => {
    app.post('/api/user/register/student', async (req, res, next) => {
        const fieldsRequired = ['id', 'name', 'surname', 'email', 'password'];
        const isRequestValid = !fieldsRequired.some(field => {
            if (!req.body[field]) {
                res.status(httpStatus.BAD_REQUEST).send({error: `Field ${field} required`});
                return true;
            }
        });
        if (!isRequestValid) return;

        const studentCreatorRequest: StudentCreatorRequest = {
            id: req.body.id,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password,
        }
        try {
            const studentCreator = container.get('Student.StudentCreator');
            await studentCreator.run(studentCreatorRequest);
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
}