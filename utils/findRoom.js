import RoomModel from "../models/Room.js";

const findRoom = async (id) => {
    let room = null;
    if (id.length > 4) {
        room = await RoomModel.findById(id);
    } else {
        room = await RoomModel.findOne({ roomId: Number(id)});
    }
    return room;
}

export default findRoom;