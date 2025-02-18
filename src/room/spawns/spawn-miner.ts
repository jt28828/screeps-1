import {HelperFunctions} from "../../global/helper-functions";
import {ReportController} from "../../reporting/report-controller";

export class SpawnMiner {
    public static trySpawnMiner(myRoom: MyRoom): void {
        if (myRoom.roomStage < 2) {
            //At stage 2, the caches are built, and 5 extensions
            return;
        }

        for (let i = 0; i < myRoom.mySources.length; i++) {
            const mySource: MySource = myRoom.mySources[i];
            if (mySource.minerName == null) {
                //Needs a new miner
                const newCreep: Miner | null = this.spawnMiner(myRoom, mySource);
                if (newCreep != null) {
                    myRoom.myCreeps.push(newCreep);
                    console.log("LOG: Spawned a new Miner");
                    return;
                }
            }
        }
    }

    private static spawnMiner(myRoom: MyRoom, mySource: MySource): Miner | null {

        if (myRoom.spawns.length === 0) {
            ReportController.log("ERROR", "Attempted to spawn miner in a room with no spawner (1)");
            return null;
        }
        const spawn: StructureSpawn = Game.spawns[myRoom.spawns[0].name];

        if (spawn == null) {
            ReportController.log("ERROR", "Attempted to spawn miner in a room with no spawner (2)");
            return null;
        }

        if (mySource.cache == null) {
            ReportController.log("ERROR", "Attempted to spawn miner to a source with no cache container pos");
            return null;
        }

        let body: BodyPartConstant[];

        let linkId: string | null = null;
        if (mySource.link != null) {
            linkId = mySource.link.id;
            body = [MOVE, CARRY, WORK, WORK, WORK, WORK, WORK];
        } else {
            //No carry
            body = [MOVE, WORK, WORK, WORK, WORK, WORK];
        }

        //Have a valid spawn now
        const id = HelperFunctions.getId();
        const result: ScreepsReturnCode =
            spawn.spawnCreep(
                body,
                "Creep" + id,
                {
                    memory:
                        {
                            name: "Creep" + id,
                            role: "Miner",
                            assignedRoomName: spawn.room.name
                        }
                }
            );

        if (result === OK) {
            mySource.minerName = "Creep" + id;
            return {
                name: "Creep" + id,
                role: "Miner",
                assignedRoomName: spawn.room.name,
                cachePosToMineOn: mySource.cache.pos,
                linkIdToDepositTo: linkId,
                sourceId: mySource.id
            };
        }

        return null;
    }

}
