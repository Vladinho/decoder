import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            password: req.body.password,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id
        }, 'test', {
            expiresIn: '30d'
        });

        const { passwordHash, ...userData}  = user._doc;
        res.json({
            ...userData,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'registration is failed!'
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: 'No user'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Password is incorrect'
            });
        }

        const token = jwt.sign({
            _id: user._id
        }, 'test', {
            expiresIn: '30d'
        });

        const { passwordHash, ...userData}  = user._doc;
        res.json({
            ...userData,
            token
        });
    } catch (err) {
        res.status(500).json({
            message: 'Auth is failed'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'no user'
            })
        }
        const { passwordHash, ...userData}  = user._doc;
        res.json(userData);
    } catch (e) {
        return res.status(403).json({
            message: 'no access'
        })
    }
}