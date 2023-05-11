import {validationResult} from "express-validator";
import {getCode} from "../utils/getCode.js";
import AnswerModel from "../models/Answer.js";
import GameModel from "../models/Game.js";
import RoomModel from "../models/Room.js";

export const answer = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const { round } = await GameModel.findById(req.body.gameId);
        const { team_1, team_2 } = await RoomModel.findById(req.body.roomId);
        const is1Team = team_1.some(i => i === req.body.user);
        const curTeam = is1Team ? team_1 : team_2;
        const nextIndex = curTeam.indexOf(req.body.user) + 1;
        const nextPlayer = curTeam[nextIndex === curTeam.length ? 0 : nextIndex];
        const newGame = is1Team ? {
            team_1_player: nextPlayer,
            team_1_code: getCode()
        } : {
            team_2_player: nextPlayer,
            team_2_code: getCode()
        }
       await GameModel.findByIdAndUpdate(req.body.gameId, newGame);
        const doc = new AnswerModel({
            round,
            gameId: req.body.gameId,
            answer:  req.body.answer,
            user: req.body.user,
            code: req.body.code
        });
        await doc.save();
        res.json(newGame);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'game registration is failed!'
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
            message: 'get game is failed'
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
                team_1_guess: req.body.guess
            } : {
                team_2_guess: req.body.guess
            });
        }
        if (req.body.agree) {
            await AnswerModel.findByIdAndUpdate(req.body.answerId, {
                $push: is1Team ? {
                    team_1_agree: req.body.user
                } : {
                    team_2_agree: req.body.user
                }
            });
        }
        if (req.body.agree) {
            await AnswerModel.findByIdAndUpdate(req.body.answerId, {
                $push: is1Team ? {
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
            message: 'game registration is failed!'
        })
    }
}

export const nextRound = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

       const { round } = await GameModel.findById(req.body.gameId);
        if (req.body.curRound === round) {
            await GameModel.findByIdAndUpdate(req.body.gameId, {
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
            message: 'nextRound registration is failed!'
        })
    }
}