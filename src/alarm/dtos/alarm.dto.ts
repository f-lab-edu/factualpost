import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class SearchAlarmData {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    cursor?: number;

    @IsOptional()
    type?: string;

    @IsOptional()
    startDate?: string;

    @IsOptional()
    endDate?: string;

    @IsOptional()
    keyword?: string;

    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder;
}