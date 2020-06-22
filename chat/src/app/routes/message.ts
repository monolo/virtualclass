import {Express, Request} from "express";
import container from "../config/dependency-injection";
import httpStatus from "http-status";
import {InvalidArgumentError} from "../../Contexts/Shared/domain/value-object/InvalidArgumentError";
import CheckTokenExpress from "../utils/CheckTokenExpress";
import {ChatsByResponse} from "../../Contexts/Chat/application/Find/ChatsByResponse";
import {CreateMessageRequest} from "../../Contexts/Message/application/CreateMessageRequest";
import {MessagesByRequest} from "../../Contexts/Message/application/Find/MessagesByRequest";

export default (app: Express) => {
    app.post('/api/chat/message', CheckTokenExpress, async (req, res, next) => {
        const fieldsRequired = ['id', 'chatId', 'type', 'value'];
        const isRequestValid = !fieldsRequired.some(field => {
            if (!req.body[field]) {
                res.status(httpStatus.BAD_REQUEST).send({error: `Field ${field} required`});
                return true;
            }
        });
        if (!isRequestValid) return;

        const createChatRequest: CreateMessageRequest = {
            id: req.body.id,
            chatId: req.body.chatId,
            type: req.body.type,
            value: req.body.value,
            sender: req.user.id
        }
        try {
            const createMessage = container.get('Message.CreateMessage');
            await createMessage.run(createChatRequest);
            res.status(httpStatus.CREATED).send();
        } catch (error) {
            if (error instanceof InvalidArgumentError)
                res.status(httpStatus.BAD_REQUEST).json({error: error.message});
            else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: error});
                console.log(error);
            }
        }
    });
    app.get('/api/chat/messages', CheckTokenExpress, async (req, res) => {
        const fieldsRequired = ['chatId'];
        const isRequestValid = !fieldsRequired.some(field => {
            if (!req.query[field]) {
                res.status(httpStatus.BAD_REQUEST).send({error: `Field ${field} required`});
                return true;
            }
        });
        if (!isRequestValid) return;
        const chatId = req.query.chatId;
        if(typeof chatId !== "string"){
            res.status(httpStatus.BAD_REQUEST).send({error: `Bad chatId`});
            return true;
        }
        const messagesByRequest: MessagesByRequest = {
            userId: req.user.id,
            chatId: chatId
        }
        try {
            const messagesBy = container.get('Message.Find.MessagesBy');
            const response:ChatsByResponse = await messagesBy.run(messagesByRequest);
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
}