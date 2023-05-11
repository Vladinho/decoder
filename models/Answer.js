import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
    answer: [{
        type: String,
        required: true,
    }],
    team_1_agree: [{
        type: String,
    }],
    team_2_agree: [{
        type: String,
    }],
    code: {
        type: String,
        required: true,
    },
    team_1_guess: {
        type: String,
    },
    team_2_guess: {
        type: String,
    },
    user: {
        type: String,
        required: true,
    },
    round: {
        type: Number,
        required: true,
    },
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Answer', AnswerSchema);
