import { GlobalFunctions } from "./global.functions";
import { StageFunctions } from "./stage.functions";

// tslint:disable-next-line: class-name
export class Stage3_3 {
    /*
    3.3 ->  3.6 : Room has >= 20 extensions
    3.3 <-  3.6 : Room has < 20 extensions
    */
    public static up(myRoom: MyRoom, room: Room): boolean {
        this.step(myRoom, room);
        if (GlobalFunctions.amountOfStructure(room, STRUCTURE_EXTENSION) >= 20) {
            myRoom.roomStage = 3.6;
            console.log("LOG: Room " + myRoom.name + " increased to room stage 3.6");
            return true;
        }
        return false;
    }

    public static down(myRoom: MyRoom, room: Room): boolean {
        if (GlobalFunctions.amountOfStructure(room, STRUCTURE_EXTENSION) < 20) {
            myRoom.roomStage = 3.3;
            console.log("LOG: Room " + myRoom.name + " decreased to room stage 3.3");
            return true;
        }
        return false;
    }

    private static step(myRoom: MyRoom, room: Room): void {
        StageFunctions.buildExtensions(myRoom, 20);
    }
}
