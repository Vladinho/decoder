import {validationResult} from "express-validator";
import RoomModel from "../models/Room.js";
import shuffle from "../utils/shuffle.js";

export const createRoom = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const doc = new RoomModel({
            mainUser: req.body.user,
            team_1: [],
            team_2: [],
            users: [req.body.user]
        })

        const room = await doc.save();

        res.json(room);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'room registration is failed!'
        })
    }
}

export const joinRoom = async (req, res) => {
    try {
        const room = await RoomModel.updateOne({ _id: req.body.id }, {
           $addToSet: {
               users: req.body.user
           }
        });
        if (!room) {
            return res.status(404).json({
                message: 'No room'
            });
        }

        res.json({
            success: true
        });

    } catch (err) {
        res.status(500).json({
            message: 'room join is failed'
        })
    }
}

export const getRoom = async (req, res) => {
    try {
        const room = await RoomModel.findById(req.query.id);
        res.json(room);

    } catch (err) {
        res.status(500).json({
            message: 'get room is failed'
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
        const team_1 = users.slice(0, divideIndex);
        const team_2 = users.slice(divideIndex);
        await RoomModel.updateOne({ _id: req.body.id }, { team_1, team_2 });
        res.json({
            success: true
        });

    } catch (err) {
        res.status(500).json({
            message: 'createTeams join is failed'
        })
    }
}