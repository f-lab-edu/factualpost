import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CONFIG_SERVICE, IConfigService } from "src/common/configs/config.interface.service";
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { Alarm } from "src/entities/Alarm";
import { Repository } from "typeorm";

@Injectable()
export class AlarmRepository {
    constructor(
        @InjectRepository(Alarm) private readonly alarmRepository: Repository<Alarm>,
        @Inject(CONFIG_SERVICE) private readonly configService: IConfigService
    ){}

    async saveAlarms(alarms: Alarm[]) {
        return this.alarmRepository.save(alarms);
    }

    async read(alarmId: number) {
        const alarm = await this.alarmRepository.findOneBy({
            id: alarmId
        });
    
        if (!alarm) {
            throw new NotFoundException(ERROR_MESSAGES.ALARM_NOT_FOUND);
        }
    
        alarm.isRead = true;
        await this.alarmRepository.save(alarm);
    }

    async getAlarms(userId: number, cursor: number): Promise<Alarm[]> {
        const limit = this.configService.getAlarmPageLimit();
        const queryBuilder = this.alarmRepository.createQueryBuilder("alarm")
                                                .leftJoinAndSelect("alarm.user", "user")
                                                .leftJoinAndSelect("alarm.article", "article")
                                                .where("alarm.userId = :userId", { userId })
                                                .orderBy("alarm.createdAt", "DESC")
        
        if (cursor) {
            queryBuilder.andWhere("alarm.id < :cursor", { cursor });
        }
    
        queryBuilder.take(limit);
    
        const alarms = await queryBuilder.getMany();
        return alarms;
    }
}