import {Constants} from "../global/constants";
import {HelperFunctions} from "../global/helper-functions";
import {ReportController} from "../reporting/report-controller";

export class AttackOneController {
    public static run(empireCommand: EmpireCommand): void {
        let flag: Flag | null = null;

        let attackOne: AttackOne = Memory.myMemory.empire.attackOne;
        if (attackOne == null) {
            flag = Game.flags["attack-one-rally"];
            if (flag == null) {
                return;
            }

            //Need to work out the rooms
            attackOne = {
                state: "Conscripting",
                roomsStillToProvide: []
            };

            let outputMessage: string = "";
            for (let i = 0; i < Memory.myMemory.rooms.length; i++) {
                const myRoom: MyRoom = Memory.myMemory.rooms[i];
                if (Game.map.getRoomLinearDistance(flag.pos.roomName, myRoom.name)
                    < Constants.CONSCRIPTION_RANGE) {
                    //This room will be conscripted
                    attackOne.roomsStillToProvide.push(myRoom);
                    outputMessage += myRoom.name + ", ";
                }
            }
            if (attackOne.roomsStillToProvide.length === 0) {
                Memory.myMemory.empire.attackOne = null;
                console.log("LOG: Canceling an AttackOne because no rooms were in conscription range.");
                return;
            }

            //Remove the ", " from the last one
            outputMessage.slice(0, outputMessage.length - 2);

            console.log("AttackOne: " + attackOne.roomsStillToProvide.length +
                " Rooms conscripted for AttackOne (" + outputMessage + ")");
        }

        if (attackOne.state === "Conscripting") {
            //Wait until every room that's required to, has added a creep
            for (let i = attackOne.roomsStillToProvide.length - 1; i >= 0; i--) {
                const myRoom: MyRoom = attackOne.roomsStillToProvide[i];
                const attackOneCreep: AttackOneCreep | null = this.spawnAttackOneCreep(myRoom);
                if (attackOneCreep != null) {
                    console.log("LOG: " + myRoom + " has been conscripted " + attackOneCreep.name + " for AttackOne");
                    Memory.myMemory.empire.creeps.push(attackOneCreep);
                    attackOne.roomsStillToProvide.splice(i, 1);
                } // else room still to provide a creep
            }

            if (attackOne.roomsStillToProvide.length === 0) {
                empireCommand.haltRoomEnergyUsage = false;
                attackOne.state = "Rally";
                return;
            }

            //Some rooms still need to provide a creep
            empireCommand.haltRoomEnergyUsage = true;
        }

        if (attackOne.state === "Rally") {
            flag = Game.flags["attack-one-rally"];
            if (flag == null) {
                ReportController.log("ERROR", "attack-one-rally flag doesn't exist during AttackOne. Cancelling the attack.");
                this.cancelAttack();
                return;
            }

            //Wait until all the creeps are within range of the rally flag
            for (let i = 0; i < Memory.myMemory.empire.creeps.length; i++) {
                const myCreep: MyCreep = Memory.myMemory.empire.creeps[i];
                if (myCreep.role !== "AttackOneCreep") {
                    continue;
                }
                const creep: Creep = Game.creeps[myCreep.name];
                if (!creep.pos.inRangeTo(flag.pos, Constants.RALLY_FLAG_RANGE)) {
                    //Not in range, returning
                    return;
                }
            }
            //If it gets here, we're ready to charge!
            attackOne.state = "Charge";
        }

        if (attackOne.state === "Charge") {
            if (Memory.myMemory.empire.creeps.length === 0) {
                // Cancel attack when the creeps are dead
                this.cancelAttack();
            }
        }
    }

    private static spawnAttackOneCreep(myRoom: MyRoom): AttackOneCreep | null {
        const spawn: StructureSpawn = Game.spawns[myRoom.spawns[0].name];

        //Have a valid spawn now
        const id: number = HelperFunctions.getId();

        const body: BodyPartConstant[] =
            HelperFunctions.generateBody([MOVE, ATTACK],
                [MOVE, ATTACK],
                spawn.room,
                true,
                10
            );

        const result: ScreepsReturnCode =
            spawn.spawnCreep(
                body,
                "Creep" + id,
                {
                    memory:
                        {
                            name: "Creep" + id,
                            role: "AttackOneCreep",
                            assignedRoomName: ""
                        }
                }
            );

        if (result === OK) {
            return {
                name: "Creep" + id,
                role: "AttackOneCreep",
                assignedRoomName: ""
            };
        }
        return null;
    }

    private static cancelAttack(): void {
        const empire: Empire = Memory.myMemory.empire;
        empire.attackOne = null;

        for (let i = empire.creeps.length - 1; i > 0; i--) {
            if (empire.creeps[i].role === "AttackOneCreep") {
                console.log("LOG: Killing AttackOneCreep " + empire.creeps[i].name);
                Game.creeps[empire.creeps[i].name].suicide();
            }
        }
        const flagNames: string[] = Object.keys(Game.flags);
        for (let i = 0; i < flagNames.length; i++) {
            if (flagNames.includes("attack-one")) {
                const flag: Flag = Game.flags[flagNames[i]];
                flag.remove();
            }
        }
    }
}
