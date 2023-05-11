import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import { registerValidation } from "./validators.js";
import checkAuth from "./utils/checkAuth.js";
import { getMe, login, register } from "./controllers/UserController.js";
import {createRoom, createTeams, getRoom, joinRoom} from "./controllers/RoomController.js";
import {createGame, getGame, getGamesByRoomId, setComment} from "./controllers/GameController.js";
import {answer, getAnswers, guess, nextRound} from "./controllers/AnswerController.js";

mongoose.connect('mongodb+srv://vladislavrepkin:lGp4cg5yzaEKsIJT@cluster0.enbmkuo.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('db - ok!'))
    .catch(() => console.log('db - error!'));

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.post('/auth/register', registerValidation, register);
app.post('/room', createRoom);
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

app.get('/', (req, res) => {
    res.send('111Hello world! 2');
});

app.get('/auth/me', checkAuth, getMe);

app.post('/auth/login', login);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Ok!');
})