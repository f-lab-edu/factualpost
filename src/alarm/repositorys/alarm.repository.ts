import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CONFIG_SERVICE, IConfigService } from "src/common/configs/config.interface.service";
import { ERROR_MESSAGES } from "src/common/constants/error-message";
import { Alarm } from "src/entities/Alarm";
import { Repository } from "typeorm";
import { IAlarmRepository } from "./alarm.interface";
import { SearchAlarmData } from "../dtos/alarm.dto";
import { SearchService } from "src/common/search/search.service";

@Injectable()
export class AlarmTypeOrmRepository implements IAlarmRepository{
    constructor(
        @InjectRepository(Alarm) private readonly alarmRepository: Repository<Alarm>,
        @Inject(CONFIG_SERVICE) private readonly configService: IConfigService,
        private readonly searchService: SearchService
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

    async getAlarms(userId: number, searchQuery: SearchAlarmData): Promise<Alarm[]> {
        const limit = this.configService.getAlarmPageLimit();
        let queryBuilder = this.alarmRepository.createQueryBuilder("alarm")
                                                .leftJoinAndSelect("alarm.user", "user")
                                                .leftJoinAndSelect("alarm.article", "article")
                                                .where("alarm.userId = :userId", { userId })
                                                .orderBy("alarm.createdAt", "DESC")
        this.searchService.applyFilter("alarm", queryBuilder, searchQuery);
        this.searchService.applySorting("alarm", queryBuilder, searchQuery);
            
        return await queryBuilder.take(limit).getMany();
    }
}