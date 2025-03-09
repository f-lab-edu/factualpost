import { Alarm } from "src/entities/Alarm"
import { SearchData } from "../dtos/alarm.dto";

export const IALARM_REPOSITORY = "IALARM_REPOSITORY";

export interface IAlarmRepository {
    saveAlarms(alarms: Alarm[])
    read(alarmId: string)
    getAlarms(userId: number, searchData: SearchData, cursor: number): Promise<Alarm[]>
}