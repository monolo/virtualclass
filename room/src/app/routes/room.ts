import {Express, Request} from "express";
import container from "../config/dependency-injection";
import httpStatus from "http-status";
import {InvalidArgumentError} from "../../Contexts/Shared/domain/value-object/InvalidArgumentError";
import {CreateRoomRequest} from "../../Contexts/Room/application/CreateRoomRequest";
import CheckTokenExpress from "../utils/CheckTokenExpress";
import {RoomAlreadyExists} from "../../Contexts/Room/domain/RoomAlreadyExists";
import {RoomRequest} from "../../Contexts/Room/application/Find/RoomRequest";
import {RoomsByRequest} from "../../Contexts/Room/application/Find/RoomsByRequest";
import {RoomsByResponse} from "../../Contexts/Room/application/Find/RoomsByResponse";
import {RoomResponse} from "../../Contexts/Room/application/Find/RoomResponse";

export default (app: Express) => {
    app.post('/api/room', CheckTokenExpress, async (req, res, next) => {
        const fieldsRequired = ['id', 'user'];
        const isRequestValid = !fieldsRequired.some(field => {
            if (!req.body[field]) {
                res.status(httpStatus.BAD_REQUEST).send({error: `Field ${field} required`});
                return true;
            }
        });
        if (!isRequestValid) return;

        const createRoomRequest: CreateRoomRequest = {
            id: req.body.id,
            createdBy: req.user.id,
            user: req.body.user
        }
        try {
            const createRoom = container.get('Room.CreateRoom');
            await createRoom.run(createRoomRequest);
            res.status(httpStatus.CREATED).send();
        } catch (error) {
            if(error instanceof RoomAlreadyExists){
                res.status(httpStatus.BAD_REQUEST).json({roomId: error.id.value, error: error.message});
            }
            else if (error instanceof InvalidArgumentError)
                res.status(httpStatus.BAD_REQUEST).json({error: error.message});
            else {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: error});
                console.log(error);
            }
        }
    });
    app.get('/api/room/rooms', CheckTokenExpress, async (req, res) => {
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
        const roomsByRequest: RoomsByRequest = {
            user: req.user.id,
            offset: offset,
            limit: limit
        }
        try {
            const roomsBy = container.get('Room.Find.RoomsBy');
            const response:RoomsByResponse = await roomsBy.run(roomsByRequest);
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
    app.get('/api/room/:id', CheckTokenExpress, async (req, res) => {
        const roomRequest: RoomRequest = {
            id: req.params.id,
            user: req.user.id
        }
        try {
            const roomFinder = container.get('Room.Find.Room');
            const response:RoomResponse = await roomFinder.run(roomRequest);
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