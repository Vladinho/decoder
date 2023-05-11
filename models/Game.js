import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
    round: {
        type: Number,
        required: true,
        default: 1
    },
    team_1_code: {
        type: String,
        required: true,
    },
    team_2_code: {
        type: String,
        required: true,
    },
    team_1_player: {
        type: String,
        required: true
    },
    team_2_player: {
        type: String,
        required: true
    },
    words_1: [{
        type: String,
        required: true,
        unique: true
    }],
    words_2: [{
        type: String,
        required: true,
        unique: true
    }],
    comment_1: {
        type: String,
    },
    comment_2: {
        type: String,
    },
    comment_3: {
        type: String,
    },
    comment_4: {
        type: String,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Game', GameSchema);
