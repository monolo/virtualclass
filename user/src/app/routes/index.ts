import {Express} from "express";
import teacher from "./teacher";
import user from "./user";
import student from "./student";

const routes = [
    teacher, user, student
]

export default (app: Express) => {
    routes.forEach(route => route(app))
}