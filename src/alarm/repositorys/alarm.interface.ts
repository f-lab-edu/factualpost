import { Alarm } from "src/entities/Alarm"

export const IALARM_REPOSITORY = "IALARM_REPOSITORY";

export interface IAlarmRepository {
    saveAlarms(alarms: Alarm[])
    read(alarmId: number)
    getAlarms(userId: number, cursor: number): Promise<Alarm[]>
}