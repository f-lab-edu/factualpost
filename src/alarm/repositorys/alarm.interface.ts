import { Alarm } from "src/entities/Alarm"
import { SearchAlarmData } from "../dtos/alarm.dto";

export const IALARM_REPOSITORY = "IALARM_REPOSITORY";

export interface IAlarmRepository {
    saveAlarms(alarms: Alarm[])
    read(alarmId: string)
    getAlarms(userId: number, searchData: SearchAlarmData): Promise<Alarm[]>
}