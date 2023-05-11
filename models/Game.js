import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
    round: {
        type: Number,
        required: true,
        default: 0
    },
    team_1_code: {
        type: String,
    },
    team_2_code: {
        type: String,
    },
    team_1_player: {
        type: String,
    },
    team_2_player: {
        type: String,
    },
    words_1: [{
        type: String,
    }],
    words_2: [{
        type: String,
    }],
    comments_1: [{
        type: String,
    }],
    comments_2: [{
        type: String,
    }],
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Game', GameSchema);
