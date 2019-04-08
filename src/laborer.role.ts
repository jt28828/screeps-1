export const laborerRole: any = {
    run: function (laborer: Laborer, myRoom: MyRoom) {
        const creep: Creep = Game.creeps[laborer.name];

        if (creep == null) {
            console.log("ERR: Laborer creep is null. Creep ID: " + laborer.name);
            return;
        }

        calculateCreepState(laborer, myRoom, creep);

        if (laborer.state === "pickup") {
            pickup(laborer, myRoom, creep);
        } else if (laborer.state === "mining") {
            mining(laborer, myRoom, creep);
        } else {
            labor(laborer, myRoom, creep);
        }
    }
};

function calculateCreepState(laborer: Laborer, myRoom: MyRoom, creep: Creep): void {
    if (laborer.state === "labor" &&
        creep.carry.energy === 0) {

        if (myRoom.bankPos == null) {
            laborer.state = "miner";
            return;
        }

        const bankPos: RoomPosition
            = new RoomPosition(myRoom.bankPos.x,
                myRoom.bankPos.y,
                myRoom.bankPos.roomName);

        let bank: StructureContainer | StructureStorage | null = null;

        const structures: Structure<StructureConstant>[] = bankPos.lookFor(LOOK_STRUCTURES);
        for (let i = 0; i < structures.length; i++) {
            const structure: Structure = structures[i];
            if (structure.structureType === STRUCTURE_CONTAINER) {
                bank = structure as StructureContainer;
                break;
            } else if (structure.structureType === STRUCTURE_STORAGE) {
                bank = structure as StructureStorage;
                break;
            }
        }

        if (bank != null &&
            bank.store[RESOURCE_ENERGY] > creep.carryCapacity) {
            laborer.state = "pickup";
            return;
        } else {
            laborer.state = "miner";
            return;
        }



    } else if ((laborer.state === "pickup" || laborer.state === "mining") &&
        creep.carry.energy === creep.carryCapacity) {
        laborer.state = "labor";
        creep.say("work work");
    }
}

function pickup(laborer: Laborer, myRoom: MyRoom, creep: Creep): void {
    if (myRoom.bankPos == null) {
        console.log("ERR: Room's bank pos was null");
        return;
    }

    const bankPos: RoomPosition
        = new RoomPosition(myRoom.bankPos.x,
            myRoom.bankPos.y,
            myRoom.bankPos.roomName);

    if (bankPos.isNearTo(creep)) {
        let bank: StructureContainer | StructureStorage | null = null;

        const structures: Structure<StructureConstant>[] = bankPos.lookFor(LOOK_STRUCTURES);
        for (let i = 0; i < structures.length; i++) {
            const structure: Structure = structures[i];
            if (structure.structureType === STRUCTURE_CONTAINER) {
                bank = structure as StructureContainer;
                break;
            } else if (structure.structureType === STRUCTURE_STORAGE) {
                bank = structure as StructureStorage;
                break;
            }
        }

        if (bank != null) {
            creep.withdraw(bank, RESOURCE_ENERGY);
        }



    } else {
        creep.moveTo(bankPos);
    }
}

function mining(laborer: Laborer, myRoom: MyRoom, creep: Creep): void {
    const source: Source | null = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (source != null &&
        creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
    }
}

function labor(laborer: Laborer, myRoom: MyRoom, creep: Creep): void {
    let givenCommand: boolean = false;

    //Check if controller is anywhere close to downgrading
    let forceUpgradeController: boolean = false;
    if (creep.room.controller != null &&
        creep.room.controller.ticksToDowngrade < 5000) {
        forceUpgradeController = true;
        givenCommand = true;
    }
    if (!givenCommand) {
        //Adding energy to structures that need it
        const structureToAddTo: Structure | null = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure: any) => {
                return (structure.structureType === STRUCTURE_EXTENSION ||
                    structure.structureType === STRUCTURE_SPAWN ||
                    structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
        if (structureToAddTo != null) {
            givenCommand = true;
            if (creep.transfer(structureToAddTo, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(structureToAddTo);
            }
        }
    }

    //Building construction sites
    if (!givenCommand) {
        const constructionSites: ConstructionSite<BuildableStructureConstant>[]
            = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (constructionSites.length > 0) {
            givenCommand = true;
            if (creep.build(constructionSites[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(constructionSites[0]);
            }
        }
    }

    //Upgrading room controller
    if ((forceUpgradeController || !givenCommand) &&
        creep.upgradeController(creep.room.controller as StructureController) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller as StructureController);
    }
}
