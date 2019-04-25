"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Stage0 {
    static up(myRoom, room) {
        if (room.controller != null &&
            room.controller.level >= 1) {
            myRoom.roomStage = 0.5;
            console.log("LOG: Room " + myRoom.name + " increased to room stage 0.5");
            return true;
        }
        return false;
    }
    static down(myRoom, room) {
        if (room.controller == null ||
            room.controller.level < 1) {
            myRoom.roomStage = 0;
            console.log("LOG: Room " + myRoom.name + " decreased to room stage 0");
            return true;
        }
        return false;
    }
}
exports.Stage0 = Stage0;
