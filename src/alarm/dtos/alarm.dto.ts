import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class GetAlarmParamDto {
    @Type(() => Number)
    @IsInt()
    cursor: number;

    @Type(() => Number)
    @IsInt()
    limit: number;
}