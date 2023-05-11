import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    mainUser: {
        type: String
    },
    team_1: [{
        type: String,
        required: true,
        unique: true
    }],
    team_2: [{
        type: String,
        required: true,
        unique: true
    }],
    users: [{
        type: String,
        required: true,
        unique: true
    }],
}, {
    timestamps: true
});

export default mongoose.model('Room', RoomSchema);
