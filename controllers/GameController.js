import {validationResult} from "express-validator";
import GameModel from "../models/Game.js";
import {getWords} from "../utils/getWords.js";
import {getCode} from "../utils/getCode.js";
import RoomModel from "../models/Room.js";

export const createGame = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const { team_1, team_2 } = await RoomModel.findById(req.body.roomId);
        const doc = new GameModel({
            roomId: req.body.roomId,
            team_1_code: getCode(),
            team_2_code: getCode(),
            words_1: getWords(4),
            words_2: getWords(4),
        });
        const room = await doc.save();

        res.json(room);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'game registration is failed!'
        })
    }
}

export const setComment = async (req, res) => {
    try {
        const comments = {
            comment_1: req.body.comment_1,
            comment_2: req.body.comment_2,
            comment_3: req.body.comment_3,
            comment_4: req.body.comment_4,
        };
        Object.keys((key) => {
            if (comments[key] === undefined) {
                delete comments[key];
            }
        })
       await GameModel.findByIdAndUpdate(req.body.gameId, {
           comments_1: req.body.comments_1,
           comments_2: req.body.comments_2,
       });

        res.json({
            success: true
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'game registration is failed!'
        })
    }
}

export const getGame = async (req, res) => {
    try {
        const game = await GameModel.findById(req.query.id);
        res.json(game);

    } catch (err) {
        res.status(500).json({
            message: 'get game is failed'
        })
    }
}

export const getGamesByRoomId = async (req, res) => {
    try {
        const game = await GameModel.findOne({
            roomId: req.query.id
        });
        if (game) {
            res.json(game);
        } else {
            res.json({
                message: 'No game'
            });
        }
    } catch (err) {
        res.status(500).json({
            message: 'get game is failed'
        })
    }
}