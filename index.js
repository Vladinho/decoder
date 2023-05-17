import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import { registerValidation } from "./validators.js";
import checkAuth from "./utils/checkAuth.js";
import { getMe, login, register } from "./controllers/UserController.js";
import {createRoom, createTeams, getRoom, getRooms, joinRoom} from "./controllers/RoomController.js";
import {createGame, getGame, getGamesByRoomId, setComment} from "./controllers/GameController.js";
import {answer, getAnswers, guess, nextRound, reset} from "./controllers/AnswerController.js";

let success = null;
let errorDb = null;

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://vladislavrepkin:lGp4cg5yzaEKsIJT@cluster0.enbmkuo.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {
        success = true;
        console.log('db - ok!')
    })
    .catch((e) => {
        success = false;
        errorDb = e;
        console.log('db - error!')
    });

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.post('/auth/register', registerValidation, register);
app.post('/room', createRoom);
app.get('/rooms', getRooms);
app.get('/room', getRoom);
app.post('/joinRoom', joinRoom);
app.post('/teams', createTeams);
app.post('/game', createGame);
app.get('/gameByRoomId', getGamesByRoomId);

app.post('/comment', setComment);
app.get('/game', getGame);
app.post('/answer', answer);
app.get('/answer', getAnswers);
app.post('/guess', guess);
app.post('/nextRound', nextRound);
app.post('/reset', reset);

app.get('/', (req, res) => {
    res.json({
        success,
        errorDb
    });
});

app.get('/auth/me', checkAuth, getMe);

app.post('/auth/login', login);

app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Ok!');
})