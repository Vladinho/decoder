import {validationResult} from "express-validator";
import {getCode} from "../utils/getCode.js";
import AnswerModel from "../models/Answer.js";
import GameModel from "../models/Game.js";
import RoomModel from "../models/Room.js";
import {getWords} from "../utils/getWords.js";

export const answer = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const { round } = await GameModel.findById(req.body.gameId);
        const doc = new AnswerModel({
            round,
            gameId: req.body.gameId,
            answer:  req.body.answer,
            user: req.body.user,
            code: req.body.code
        });
        await doc.save();
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

export const getAnswers = async (req, res) => {
    try {
        const game = await AnswerModel.find({
            gameId: req.query.gameId
        });
        res.json(game);

    } catch (err) {
        res.status(500).json({
            message: 'get game is failed' + `${err ? JSON.stringify(err) : ''}`
        })
    }
}

export const guess = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const { team_1 } = await RoomModel.findById(req.body.roomId);
        const is1Team = team_1.some(i => i === req.body.user);
        if (req.body.guess) {
            await AnswerModel.findByIdAndUpdate(req.body.answerId, is1Team ? {
                team_1_guess: req.body.guess,
                team_1_agree: [req.body.user],
            } : {
                team_2_guess: req.body.guess,
                team_2_agree: [req.body.user],
            });
        }
        const { team_1_agree, team_2_agree } = await AnswerModel.findById(req.body.answerId);

        console.log(team_1_agree, team_2_agree)
        if (req.body.agree && !team_1_agree.some(i => i === req.body.user) && !team_2_agree.some(i => i === req.body.user)) {
            await AnswerModel.findByIdAndUpdate(req.body.answerId, {
                $addToSet: is1Team ? {
                    team_1_agree: req.body.user
                } : {
                    team_2_agree: req.body.user
                }
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

export const nextRound = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const { team_1, team_2 } = await RoomModel.findById(req.body.roomId);
        const { team_1_player, team_2_player } = await GameModel.findById(req.body.gameId);

       const { round } = await GameModel.findById(req.body.gameId);
        const team_1_next_player_index = team_1.indexOf(team_1_player) + 1;
        const team_2_next_player_index =  team_2.indexOf(team_2_player) + 1;

        const team_1_next_player = team_1[team_1_next_player_index === team_1.length ? 0 : team_1_next_player_index]
        const team_2_next_player = team_2[team_2_next_player_index === team_2.length ? 0 : team_2_next_player_index]

        if (req.body.curRound === round) {
            await GameModel.findByIdAndUpdate(req.body.gameId, {
                team_1_player: team_1_next_player,
                team_2_player: team_2_next_player,
                team_1_code: getCode(),
                team_2_code: getCode(),
                $inc: {
                    round: 1
                }
            });
        }

        res.json({
            nextRound: (await GameModel.findById(req.body.gameId)).round
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'nextRound registration is failed!' + `${err ? JSON.stringify(err) : ''}`
        })
    }
}

export const reset = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        await AnswerModel.find({
            gameId: req.body.gameId
        }).deleteMany();

        const a = await AnswerModel.find({
            gameId: req.body.gameId
        });
        const { team_1, team_2 } = await RoomModel.findById(req.body.roomId);
        await GameModel.findByIdAndUpdate(req.body.gameId, {
            team_1_player: team_1[0],
            team_2_player: team_2[0],
            team_1_code: getCode(),
            team_2_code: getCode(),
            words_1: getWords(4),
            words_2: getWords(4),
            comments_1: [],
            comments_2: [],
            round: 1
        });

        res.json({
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'reset registration is failed!' + `${err ? JSON.stringify(err) : ''}`
        })
    }
}