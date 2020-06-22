import {Express, Request} from "express";
import container from "../config/dependency-injection";
import httpStatus from "http-status";
import {InvalidArgumentError} from "../../Contexts/Shared/domain/value-object/InvalidArgumentError";
import {CreateChatRequest} from "../../Contexts/Chat/application/CreateChatRequest";
import CheckTokenExpress from "../utils/CheckTokenExpress";
import {ChatAlreadyExists} from "../../Contexts/Chat/domain/ChatAlreadyExists";
import {ChatRequest} from "../../Contexts/Chat/application/Find/ChatRequest";
import {ChatsByRequest} from "../../Contexts/Chat/application/Find/ChatsByRequest";
import {ChatsByResponse} from "../../Contexts/Chat/application/Find/ChatsByResponse";
import {ChatResponse} from "../../Contexts/Chat/application/Find/ChatResponse";

export default (app: Express) => {
    app.post('/api/chat', CheckTokenExpress, async (req, res, next) => {
        const fieldsRequired = ['id', 'user'];
        const isRequestValid = !fieldsRequired.some(field => {
            if (!req.body[field]) {
                res.status(httpStatus.BAD_REQUEST).send({error: `Field ${field} required`});
                return true;
            }
        });
        if (!isRequestValid) return;

        const createChatRequest: CreateChatRequest = {
            id: req.body.id,
            createdBy: req.user.id,
            user: req.body.user
        }
        try {
            const createChat = container.get('Chat.CreateChat');
            await createChat.run(createChatRequest);
            res.status(httpStatus.CREATED).send();
        } catch (error) {
            if(error instanceof ChatAlreadyExists){
                res.status(httpStatus.BAD_REQUEST).json({chatId: error.id.value, error: error.message});
            }
            else if (error instanceof InvalidArgumentError)
                res.status(httpStatus.BAD_REQUEST).json({error: error.message});
            else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: error});
                console.log(error);
            }
        }
    });
    app.get('/api/chat/chats', CheckTokenExpress, async (req, res) => {
        const fieldsRequired = ['offset', 'limit'];
        const isRequestValid = !fieldsRequired.some(field => {
            if (!req.query[field]) {
                res.status(httpStatus.BAD_REQUEST).send({error: `Field ${field} required`});
                return true;
            }
        });
        if (!isRequestValid) return;

        // @ts-ignore
        const offset = parseInt(req.query.offset);
        // @ts-ignore
        const limit = parseInt(req.query.limit);
        const chatsByRequest: ChatsByRequest = {
            user: req.user.id,
            offset: offset,
            limit: limit
        }
        try {
            const chatsBy = container.get('Chat.Find.ChatsBy');
            const response:ChatsByResponse = await chatsBy.run(chatsByRequest);
            res.status(httpStatus.CREATED).json(response);
        } catch (error) {
            if (error instanceof InvalidArgumentError)
                res.status(httpStatus.BAD_REQUEST).json({error: error.message});
            else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: error});
                console.log(error);
            }
        }
    });
    app.get('/api/chat/:id', CheckTokenExpress, async (req, res) => {
        const chatRequest: ChatRequest = {
            id: req.params.id,
            user: req.user.id
        }
        try {
            const chatFinder = container.get('Chat.Find.Chat');
            const response:ChatResponse = await chatFinder.run(chatRequest);
            res.status(httpStatus.CREATED).json(response);
        } catch (error) {
            if (error instanceof InvalidArgumentError)
                res.status(httpStatus.BAD_REQUEST).json({error: error.message});
            else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: error});
                console.log(error);
            }
        }
    })
}