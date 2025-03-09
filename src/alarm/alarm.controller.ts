import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { AlarmService } from "./alarm.service";
import { UseAuth } from "src/common/decorators/user.auth.decorator";
import { GetUser } from "src/common/decorators/user.param.decorator";
import { UserProfile } from "src/user/dtos/user.dto";
import { SearchData } from "./dtos/alarm.dto";

@Controller('alarm')
export class AlarmController {
    constructor(
        private readonly alarmService: AlarmService
    ){}

    @UseAuth()
    @Get()
    async getAlarms(
        @GetUser() user: UserProfile,
        @Body() searchData: SearchData,
        @Query('cursor') cursor: number,
    ) {
        const alarms = await this.alarmService.getAlarms(user.id, searchData, cursor);
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

    @Post('send/admin/:ariticleId')
    async sendAdminAlarm(
        @Param('articleId', ParseIntPipe) articleId: number
    ) {
        await this.alarmService.sendAdminAlarms(articleId);
    }

    @UseAuth()
    @Post('read/:alarmId')
    async readAlarm(@Param('alarmId') alarmId: string) {
        await this.alarmService.readAlarm(alarmId);
    }    
}