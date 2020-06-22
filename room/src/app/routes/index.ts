import {Express} from "express";
import room from "./room";
import message from "./message";

const routes = [
    message, room
]

export default (app: Express) => {
    routes.forEach(route => route(app))
}