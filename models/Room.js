import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    mainUser: {
        type: String
    },
    team_1: [{
        type: String,
        required: true,
    }],
    team_2: [{
        type: String,
        required: true,
    }],
    users: [{
        type: String,
        required: true,
    }],
}, {
    timestamps: true
});

export default mongoose.model('Room', RoomSchema);
