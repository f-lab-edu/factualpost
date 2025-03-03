import { Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { AlarmService } from "./alarm.service";
import { UseAuth } from "src/common/decorators/user.auth.decorator";
import { GetUser } from "src/common/decorators/user.param.decorator";
import { UserProfile } from "src/user/dtos/user.dto";

@Controller('alarm')
export class AlarmController {
    constructor(
        private readonly alarmService: AlarmService
    ){}

    @UseAuth()
    @Get()
    async getAlarm(
        @GetUser() user: UserProfile,
        @Query('cursor') cursor: number,
    ) {
        const alarms = await this.alarmService.getAlarm(user.id, cursor);
        return alarms;
    }

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
}