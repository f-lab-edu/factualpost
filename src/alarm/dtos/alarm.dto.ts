import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class SearchData {

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    keyword?: string;

    @IsOptional()
    @IsDate()
    startDate?: string;

    @IsOptional()
    @IsDate()
    endDate?: string;

    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder;
}