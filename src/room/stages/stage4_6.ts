import {HelperFunctions} from "../../global/helper-functions";
import {StageFunctions} from "./stage-functions";
import {ReportController} from "../../reporting/report-controller";

// tslint:disable-next-line: class-name
export class Stage4_6 {
    /*
    4.6 ->  4.8 : Room has 2 links
    4.6 <-  4.8 : Room has < 2 links
    */
    public static up(myRoom: MyRoom, room: Room): boolean {
        this.step(myRoom, room);
        if (HelperFunctions.amountOfExtensions(room, STRUCTURE_LINK) >= 2) {
            myRoom.roomStage = 4.8;
            ReportController.log("STAGE", "Room " + myRoom.name + " increased to room stage 4.8");
            return true;
        }
        return false;
    }

    public static down(myRoom: MyRoom, room: Room): boolean {
        if (HelperFunctions.amountOfExtensions(room, STRUCTURE_LINK) < 2) {
            myRoom.roomStage = 4.6;
            ReportController.log("STAGE", "Room " + myRoom.name + " decreased to room stage 4.6");
            return true;
        }
        return false;
    }

    private static step(myRoom: MyRoom, room: Room): void {

        //Bank link logic
        const roomFlags: Flag[] = HelperFunctions.getRoomsFlags(myRoom);
        for (let i = roomFlags.length - 1; i >= 0; i--) {
            const roomFlag: Flag = roomFlags[i];
            const flagNameSplit: string[] = roomFlag.name.split("-");
            if (flagNameSplit[0] !== "link" ||
                flagNameSplit[1] !== "bank") {
                roomFlags.splice(i, 1);
            }
        }

        let placedBankLink: boolean = false;

        for (let i = 0; i < roomFlags.length; i++) {
            const roomFlag: Flag = roomFlags[i];
            const result: ScreepsReturnCode = Game.rooms[myRoom.name].createConstructionSite(roomFlag.pos, STRUCTURE_LINK);
            if (result === OK) {
                myRoom.bankLink = {
                    pos: HelperFunctions.roomPosToMyPos(roomFlag.pos),
                    id: null
                };
                roomFlag.remove();
                placedBankLink = true;
                console.log("LOG: Placed a bank link construction site");
            } else {
                ReportController.log("ERROR", "Placing a bank link construction site errored");
            }
        }
        if (myRoom.bankLink != null) {
            const linkPos: RoomPosition = HelperFunctions.myPosToRoomPos(myRoom.bankLink.pos);
            const structures: Structure<StructureConstant>[] = linkPos.lookFor(LOOK_STRUCTURES);
            for (let j = 0; j < structures.length; j++) {
                if (structures[j].structureType === STRUCTURE_LINK) {
                    myRoom.bankLink.id = structures[j].id;
                    break;
                }
            }
        }

        if (!placedBankLink &&
            Game.rooms[myRoom.name].find(FIND_CONSTRUCTION_SITES).length === 0) {
            console.log("ATTENTION: Room " + myRoom.name + " needs bank link flag (link-bank-X)");
        }

        //Source links
        StageFunctions.setupSourceLink(myRoom);
        StageFunctions.setupOutLink(myRoom);
    }
}
