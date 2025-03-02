import { Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { AlarmService } from "./alarm.service";
import { UseAuth } from "src/common/decorators/user.auth.decorator";
import { GetUser } from "src/common/decorators/user.param.decorator";
import { UserProfile } from "src/user/dtos/user.dto";
import { GetAlarmParamDto } from "./dtos/alarm.dto";

@Controller('alarm')
export class AlarmController {
    constructor(
        private readonly alarmService: AlarmService
    ){}

    @UseAuth()
    @Post('send/:articleId')
    async sendAlarm(
        @GetUser() user: UserProfile,
        @Param('articleId', ParseIntPipe) articleId: number
    ) {
        await this.alarmService.sendAlarms(articleId, user.id);
    }

    @UseAuth()
    @Post('read/:alarmId')
    async readAlarm(@Param('alarmId', ParseIntPipe) alarmId: number) {
        await this.alarmService.readAlarm(alarmId);
    }

    @UseAuth()
    @Get('/:cursor/:limit')
    async getAlarm(
        @GetUser() user: UserProfile,
        @Param() params: GetAlarmParamDto,
    ) {
        const alarms = await this.alarmService.getAlarm(user.id, params.cursor, params.limit);
        return alarms;
    }
    
}