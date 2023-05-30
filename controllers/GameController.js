import {validationResult} from "express-validator";
import GameModel from "../models/Game.js";
import {getWords} from "../utils/getWords.js";
import {getCode} from "../utils/getCode.js";
export const createGame = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

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
            message: 'game registration is failed!' + `${err ? JSON.stringify(err) : ''}`
        })
    }
}

export const setComment = async (req, res) => {
    try {
        const { comments_1, comments_2 } = await GameModel.findById(req.body.gameId);
        if (req.body.comments_1 && req.body.comments_1.length) {
            const user = req.body.comments_1[0].split('__')[0];
            await GameModel.findByIdAndUpdate(req.body.gameId, {
                comments_1: [...comments_1.filter(i => i.indexOf(user) !== 0), ...req.body.comments_1],
            });
        }
        if (req.body.comments_2) {
            const user = req.body.comments_2[0].split('__')[0];
            await GameModel.findByIdAndUpdate(req.body.gameId, {
                comments_2: [...comments_2.filter(i => i.indexOf(user) !== 0), ...req.body.comments_2],
            });
        }

        res.json({
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'game registration is failed!' + `${err ? JSON.stringify(err) : ''}`
        })
    }
}

export const getGame = async (req, res) => {
    try {
        const game = await GameModel.findById(req.query.id);
        res.json(game);

    } catch (err) {
        res.status(500).json({
            message: 'get game is failed' + `${err ? JSON.stringify(err) : ''}`
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
            message: 'get game is failed' + `${err ? JSON.stringify(err) : ''}`
        })
    }
}