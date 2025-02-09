// tslint:disable-next-line: class-name
import {ReportController} from "../../reporting/report-controller";

export class StageDefault {
    /*
    -1  ->  0   : Get a room controller that's mine
    -1  <-  0   : Have no room controller that's mine
    */
    public static up(myRoom: MyRoom, room: Room): boolean {
        if (room.controller != null &&
            room.controller.my === true) {
            myRoom.roomStage = 0;
            ReportController.log("STAGE", "Room " + myRoom.name + " increased to room stage 0");
            return true;
        }
        return false;
    }

    public static down(myRoom: MyRoom, room: Room): boolean {
        if (room.controller == null ||
            room.controller.my === false) {
            myRoom.roomStage = -1;
            ReportController.log("STAGE", "Room " + myRoom.name + " decreased to room stage -1");
            return true;
        }
        return false;
    }
}
