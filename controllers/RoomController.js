import {validationResult} from "express-validator";
import RoomModel from "../models/Room.js";
import shuffle from "../utils/shuffle.js";
import getRandomRoomId from "../utils/getRandomRoomId.js";
import findRoom from "../utils/findRoom.js";
import WsProvider from "../websokets.js";

export const createRoom = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const roomId = await getRandomRoomId();

        const doc = new RoomModel({
            mainUser: req.body.user,
            team_1: [],
            team_2: [],
            users: [req.body.user],
            roomId
        })

        const room = await doc.save();

        res.json(room);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'room registration is failed!' + `${err ? JSON.stringify(err) : ''}`
        })
    }
}

export const joinRoom = async (req, res) => {
    try {
        const room = await findRoom(req.body.id);

        if (!room) {
            return res.status(404).json({
                message: 'No room'
            });
        }

        if (room?.team_1?.length && room?.team_2?.length && !room?.team_1?.some(i => i === req.body.user) && !room?.team_2?.some(i => i === req.body.user)) {
            return res.status(404).json({
                message: 'The game has already been started!'
            });
        }

        await RoomModel.findByIdAndUpdate(room._id, {
           $addToSet: {
               users: req.body.user
           }
        });

        res.json(room);

        console.log(new WsProvider().clients, req.body.id)

        new WsProvider().clients[room._id]?.forEach((ws) => {
            ws.send('update room')
        })

    } catch (err) {
        res.status(500).json({
            message: 'room join is failed' + `${err ? JSON.stringify(err) : ''}`
        })
    }
}

export const getRoom = async (req, res) => {
    try {
        let room = null;
        if (req.query.id.length > 4) {
            room = await RoomModel.findById(req.query.id);
        } else {
            room = await RoomModel.findOne({ roomId: Number(req.query.id) })
        }

        res.json(room);

    } catch (err) {
        res.status(500).json({
            message: 'get room is failed' + `${err ? JSON.stringify(err) : ''}`
        })
    }
}

export const getRooms = async (req, res) => {
    try {
        const rooms = await RoomModel.find();
        res.json(rooms);

    } catch (err) {
        res.status(500).json({
            message: 'get rooms is failed' + `${err ? JSON.stringify(err) : ''}`
        })
    }
}


export const createTeams = async (req, res) => {
    try {
        const room = await RoomModel.findById(req.body.id);
        if (!room) {
            return res.status(404).json({
                message: 'No room'
            });
        }
        const users = shuffle(room.users);
        const divideIndex = Math.floor(users.length / 2);
        const team_1 = req.body.team_1 || users.slice(0, divideIndex);
        const team_2 = req.body.team_2 || users.slice(divideIndex);
        await RoomModel.updateOne({ _id: req.body.id }, { team_1, team_2 });
        res.json({ team_1, team_2 });

    } catch (err) {
        res.status(500).json({
            message: 'createTeams join is failed' + `${err ? JSON.stringify(err) : ''}`
        })
    }
}