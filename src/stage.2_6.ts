import { global } from "global";

export const stage2_6: StageController = {
    /*
    2.6 ->  3   : Room has >= 10 extensions
    2.6 <-  3   : Room has < 10 extensions
    */
    up: function (myRoom: MyRoom, room: Room): boolean {
        if (global.amountOfStructure(room, STRUCTURE_EXTENSION) >= 10) {
            myRoom.roomStage = 3;
            console.log("LOG: Room " + myRoom.name + " increased to room stage 3");
            return true;
        }
        return false;
    },
    down: function (myRoom: MyRoom, room: Room): boolean {
        if (global.amountOfStructure(room, STRUCTURE_EXTENSION) < 10) {
            myRoom.roomStage = 2.6;
            console.log("LOG: Room " + myRoom.name + " decreased to room stage 2.6");
            return true;
        }
        return false;
    },
    step: function (myRoom: MyRoom, room: Room): void {
        global.buildExtensions(myRoom, 10);
    }
};
