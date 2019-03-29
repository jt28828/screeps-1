import { controllerLogic1 } from "controller.logic1";

console.log("Script reloaded");
Memory.myMemory.myRooms = [];
export const loop: any = function () {
    clearDeadCreeps();
    ensureAllRoomsInMyMemory();
    validateRoomsInMyMemory();

    for (let i = 0; i < Memory.myMemory.myRooms.length; i++) {
        const myRoom: MyRoom = Memory.myMemory.myRooms[i];
        controllerLogic1.run(myRoom);
    }

};

function clearDeadCreeps(): void {
    //Clear all dead creeps
    for (const i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}

function ensureAllRoomsInMyMemory(): void {

    //Ensuring all the rooms are in Memory.myMemory.myRooms
    for (const roomName in Game.rooms) {
        const room: Room = Game.rooms[roomName];

        let alreadyInMemory: boolean = false;
        if (room.controller == null ||
            room.controller.my === false) {
            //No need to process rooms that don't have controllers or are not mine
            //We only have access to these rooms through travelers (probs)
            alreadyInMemory = true;
        }

        for (let i = 0; i < Memory.myMemory.myRooms.length; i++) {
            const myRoom = Memory.myMemory.myRooms[i];
            if (myRoom.name === roomName) {
                alreadyInMemory = true;
            }
        }

        if (!alreadyInMemory) {
            //Add it
            console.log("Adding a new room " + roomName);
            const newMyRoom: MyRoom = {
                name: roomName,
                myCreeps: [],
                spawnName: undefined,
                mySources: [],
                myContainers: [],
            };
            const sources: Source[] = room.find(FIND_SOURCES);
            for (let i = 0; i < sources.length; i++) {
                const source: Source = sources[i];
                newMyRoom.mySources.push({ id: source.id, cacheContainerId: undefined, minerName: undefined });
            }
            //TODO: Somehow check for a container cache nearby

            //Initially add all existing creeps
            for (const creepName in Game.creeps) {
                const creep: Creep = Game.creeps[creepName];
                creep.memory.assignedRoomName = roomName;
                if (creep.memory.mining == null) {
                    creep.memory.mining = true;
                }
                console.log(JSON.stringify(creep.memory));
                newMyRoom.myCreeps.push(
                    creep.memory
                );
            }
            console.log(JSON.stringify(newMyRoom.myCreeps));

            //Check the spawn
            const spawns: StructureSpawn[] = room.find<StructureSpawn>(FIND_MY_STRUCTURES,
                {
                    filter: { structureType: STRUCTURE_SPAWN }
                }
            );
            if (spawns.length >= 1) {
                newMyRoom.spawnName = spawns[0].name;
            }

            Memory.myMemory.myRooms.push(newMyRoom);
        }
    }
}

function validateRoomsInMyMemory(): void {
    //Validation of the myRooms
    for (let i = 0; i < Memory.myMemory.myRooms.length; i++) {
        const myRoom: MyRoom = Memory.myMemory.myRooms[i];
        const room: Room = Game.rooms[myRoom.name];
        if (room == null) {
            console.error("Lost vision of a room " + myRoom.name);
            continue;
        }

        for (let j = myRoom.myCreeps.length - 1; j >= 0; j--) {
            const myCreep: MyCreep = myRoom.myCreeps[j];
            if (Game.creeps[myCreep.name] == null) {
                //Creep is dead
                if (myCreep.role === "Miner") {
                    //Need to check what source it was on
                    for (let k = 0; k < myRoom.mySources.length; k++) {
                        const mySource: MySource = myRoom.mySources[k];
                        if (mySource.minerName === myCreep.name) {
                            mySource.minerName = undefined;
                        }
                    }
                }
                myRoom.myCreeps.splice(j, 1);
                console.log("Creep is dead and has been removed from a room");
            }
        }
    }
}
