import { globalFunctions } from "global.functions";

export const roleClaimer: any = {
    run: function (claimer: Claimer) {
        const creep: Creep = Game.creeps[claimer.name];
        if (creep == null) {
            console.log("ERR: Claimer creep is null. Creep ID: " + claimer.name);
            return;
        }
        const flag: Flag = Game.flags[claimer.flagName];
        if (flag == null) {
            //Kill the creep
            creep.suicide();
        }

        if (claimer.assignedRoomName !== creep.room.name) {
            creep.say("Fukn Lost");
            creep.moveTo(new RoomPosition(25, 25, claimer.assignedRoomName));
            return;
        } else {
            //Inside the room
            if (creep.room.controller == null) {
                console.log("ERR: Claimer can't claim a room with no controller");
                return;
            }
            if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }

    }
};
