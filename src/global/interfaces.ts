interface CreepMemory extends MyCreep {
    [key: string]: any;
}

interface FlagMemory {
}

interface SpawnMemory {
}

interface RoomMemory {
}

interface MyMemory {
    globalId: number;
    myRooms: MyRoom[];
    empire: Empire;
    report: ReportLog;
}

/*
====================
    EMPIRE:
====================
*/

interface Empire {
    attackQuick: AttackQuick | null;
    attackPressure: AttackPressure | null;
    creeps: MyCreep[];
}

type AttackQuickStateType = "Conscripting" | "Rally" | "Charge";

interface AttackQuick {
    state: AttackQuickStateType;
    roomsStillToProvide: MyRoom[];
    attackTarget: AttackTarget | null;
}

interface AttackPressure {
    batchesStarted: number;
    batches: AttackPressureBatch[];
    attackTarget: AttackTarget | null;
    roomsInRange: MyRoom[];
}

interface AttackPressureBatch {
    state: AttackQuickStateType;
    batchNumber: number;
    roomsStillToProvide: MyRoom[];
}

interface EmpireCommand {
    haltRoomEnergyUsage: boolean;
}

interface AttackTarget {
    roomObject: Creep | Structure<StructureConstant>;
    id: string;
    type: string;
}

interface BestPathFindRoomObjectResult<T extends RoomObject> {
    roomObject: T;
    pathFinderPath: PathFinderPath;
}

/*
====================
    ROOM:
====================
*/
type Stage =
    -1
    | 0
    | 0.5
    | 1
    | 1.3
    | 1.6
    | 2
    | 2.3
    | 2.6
    | 3
    | 3.3
    | 3.6
    | 4
    | 4.2
    | 4.4
    | 4.6
    | 4.8
    | 5
    | 5.2
    | 5.4
    | 5.6
    | 5.8
    | 5.9
    | 6;

interface MyRoom {
    name: string;
    myCreeps: MyCreep[];
    spawns: MySpawn[];
    mySources: MySource[];
    roomStage: Stage;
    bankPos: MyRoomPos | null;
    bankLinkerName: string | null; //Null when bankLinker is dead or not assigned
    bankLink: MyLink | null;
    bank: StructureStorage | null;
    outLinks: MyLink[];
}

interface MySpawn {
    position: MyRoomPos;
    name: string;
}

interface MySource {
    id: string;
    state: "NoCache" | "Cache" | "Link";
    minerName: string | null; //Null when miner is dead or not assigned
    haulerNames: string[];
    haulerCooldown: number;
    cache: MyCache | null;
    link: MyLink | null;
}

interface MyCache {
    pos: MyRoomPos;
    id: string | null;
}

interface MyLink {
    pos: MyRoomPos;
    id: string | null;
}

interface MyRoomPos {
    x: number;
    y: number;
    roomName: string;
}

/*
====================
    CREEPS:
====================
*/

interface MyCreep {
    name: string;
    role: "Hauler" | "Miner" | "Laborer" | "Claimer" | "BankLinker" | "AttackQuickCreep" | "AttackPressureCreep";
    assignedRoomName: string;
}

interface Miner extends MyCreep {
    sourceId: string;
    cachePosToMineOn: MyRoomPos;
    linkIdToDepositTo: string | null;
}

interface Hauler extends MyCreep {
    pickup: boolean;
    cachePosToPickupFrom: MyRoomPos;
}

interface Laborer extends MyCreep {
    state: "PickupBank" | "Mining" | "Labor" | "PickupCache" | "PickupOutLink";
}


interface Claimer extends MyCreep {
    flagName: string;
}

interface BankLinker extends MyCreep {
}

interface AttackQuickCreep extends MyCreep {
}
interface AttackPressureCreep extends MyCreep {
    batchNumber: number;
}


/*
====================
    REPORTS:
====================
*/
interface ReportLog {
    lastReportTimeStamp: number;
    reports: Report[];
}

interface Report {
    timeStamp: number;
    tick: number;
    messageType: ReportMessageType;
    message: string;
}

type ReportMessageType = "DEFENCE" | "STAGE" | "ERROR" | "OTHER";
