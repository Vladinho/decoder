import RoomModel from "../models/Room.js";

const getRandomRoomId = async () => {
    let curAttempt = 0;
    let roomId = null;

    while (curAttempt < 4) {
        roomId = Math.floor(1000 + Math.random() * 9000);
        const rooms = await RoomModel.find({ roomId });
        if  (rooms?.length === 0) {
            return roomId;
        }
        curAttempt++;
    }

    return null;
}

export default getRandomRoomId;
