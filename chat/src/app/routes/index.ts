import {Express} from "express";
import chat from "./chat";
import message from "./message";

const routes = [
    message, chat
]

export default (app: Express) => {
    routes.forEach(route => route(app))
}