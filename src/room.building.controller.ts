export const roomBuildingController: any = {
    run: function (myRoom: MyRoom) {
        if (Game.rooms[myRoom.name] == null) {
            //No longer have vision of this room
            console.log("ERR: No longer have vision of room " + myRoom.name);
            return;
        }
        //Can still see the room

        //TODO: Ensure all extensions and towers still exist

        if (myRoom.roomStage === 0.3) {
            roomNeedsFirstSpawn(myRoom);
        } else if (myRoom.roomStage === 0.6) {
            buildExtensions(myRoom, 5);
        } else if (myRoom.roomStage === 1.5) {
            buildExtensions(myRoom, 10);
        } else if (myRoom.roomStage === 2.2) {
            buildTowers(myRoom, 1);
        } else if (myRoom.roomStage === 2.4) {
            //TODO: Needs caches and a container bank
        } else if (myRoom.roomStage === 2.8) {
            buildExtensions(myRoom, 20);
        }
    }
};

function roomNeedsFirstSpawn(myRoom: MyRoom): void {
    // TODO: Code this
    console.log("ATTENTION: Build your first spawn");
}

function buildExtensions(myRoom: MyRoom, numberOfExtensionsToBuild: number): void {
    const roomFlags: Flag[] = getRoomsFlags(myRoom);
    for (let i = 0; i < roomFlags.length; i++) {
        const roomFlag: Flag = roomFlags[i];
        const flagNameSplit: string[] = getFlagNameSplit(roomFlag);
        if (flagNameSplit[0] === "ex") {
            const extensionNumber: number = Number(flagNameSplit[1]);
            if (extensionNumber <= numberOfExtensionsToBuild) {
                const result: ScreepsReturnCode = Game.rooms[myRoom.name].createConstructionSite(roomFlag.pos, STRUCTURE_EXTENSION);
                if (result === OK) {
                    console.log("LOG: Placed extension construction site");
                    myRoom.myExtensionPositions.push({
                        x: roomFlag.pos.x,
                        y: roomFlag.pos.y,
                        roomName: myRoom.name
                    });
                    roomFlag.remove();
                } else {
                    console.log("ERR: Placing a extension construction site errored");
                }
            }
        }
    }
}

function buildTowers(myRoom: MyRoom, numberOfTowersToBuild: number): void {
    const roomFlags: Flag[] = getRoomsFlags(myRoom);
    for (let i = 0; i < roomFlags.length; i++) {
        const roomFlag: Flag = roomFlags[i];
        const flagNameSplit: string[] = getFlagNameSplit(roomFlag);
        if (flagNameSplit[0] === "tower") {
            const towerNumber: number = Number(flagNameSplit[1]);
            if (towerNumber <= numberOfTowersToBuild) {
                const result: ScreepsReturnCode = Game.rooms[myRoom.name].createConstructionSite(roomFlag.pos, STRUCTURE_TOWER);
                if (result === OK) {
                    console.log("LOG: Placed tower construction site");
                    myRoom.myTowerPositions.push({
                        x: roomFlag.pos.x,
                        y: roomFlag.pos.y,
                        roomName: myRoom.name
                    });
                    roomFlag.remove();
                } else {
                    console.log("ERR: Placing a tower construction site errored");
                }
            }
        }
    }
}

function isConstructable(terrain: RoomTerrain, roomName: string, x: number, y: number): boolean {
    if (x < 0 || x > 49 || y < 0 || y > 49) {
        return false;
    }
    if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
        const roomPos: RoomPosition = new RoomPosition(x, y, roomName);
        const structures: Structure<StructureConstant>[] = roomPos.lookFor(LOOK_STRUCTURES);
        if (structures.length !== 0) {
            return false;
        } else {
            return true;
        }
    }

    return false;
}

function getFlagNameSplit(flag: Flag): string[] {
    return flag.name.split("-");
}

function getRoomsFlags(myRoom: MyRoom): Flag[] {
    const result: Flag[] = [];
    const flagNames: string[] = Object.keys(Game.flags);
    for (let i = 0; i < flagNames.length; i++) {
        const flag: Flag = Game.flags[flagNames[i]];
        if (flag.room != null &&
            flag.room.name === myRoom.name) {
            result.push(flag);
        }
    }
    return result;
}
