import {ReportController} from "../../reporting/report-controller";

export class RoleBankLinker {
    public static run(bankLinker: BankLinker, myRoom: MyRoom): void {
        const creep: Creep = Game.creeps[bankLinker.name];
        if (creep == null) {
            ReportController.log("ERROR", "BankLinker creep is null. Creep ID: " + bankLinker.name);
            return;
        }

        if (bankLinker.assignedRoomName !== creep.room.name) {
            creep.say("Fukn Lost");
            creep.moveTo(new RoomPosition(25, 25, bankLinker.assignedRoomName));
            return;
        }

        if (creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
            const bank: StructureStorage | null = myRoom.bank;
            if (bank == null) {
                ReportController.log("ERROR", "Bank was null for a bank linker");
                return;
            }

            if (creep.transfer(bank, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(bank);
            }
        } else {
            if (myRoom.bankLink == null ||
                myRoom.bankLink.id == null) {
                ReportController.log("ERROR", "Bank Link was null for a bank linker");
                return;
            }
            const link: StructureLink | null = Game.getObjectById(myRoom.bankLink.id);
            if (link == null) {
                ReportController.log("ERROR", "Bank Link was null for a bank linker");
                return;
            }

            if (creep.withdraw(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(link);
            }
        }
    }
}
