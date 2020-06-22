import {NextFunction, Request, Response} from "express";
import httpStatus from "http-status";
import jwt from 'jsonwebtoken';
import config from "../config/config";

export default (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization
    if (!header) {
        res.status(httpStatus.FORBIDDEN).json({error: 'Unauthorized'});
        return;
    }
    try {
        if (typeof header === "string") {
            req.user = jwt.verify(header, config.get('jwtSecret'));
            next();
        }
    } catch (err) {
        res.status(httpStatus.FORBIDDEN).send();
        return;
    }
}