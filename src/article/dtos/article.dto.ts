import { PickType } from "@nestjs/mapped-types";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ArticleDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    contents: string;
}

export class CreateArticle extends PickType(ArticleDto, ['title', 'contents'] ) {
    @IsOptional()
    @Transform(({ value }) => value || null)
    userId: number;
}

export class UpdateArticle extends PickType(ArticleDto, ['title', 'contents'] ) {
    @IsOptional()
    @Transform(({ value }) => value || null)
    userId: number;
}

export class RemoveArticle {
    @Type(() => Number)
    @IsInt()
    id: number;

    @IsOptional()
    @Transform(({ value }) => value || null)
    userId?: number;
}

export class GetParamArticle {
    @Type(() => Number)
    @IsInt()
    cursor: number;

    @Type(() => Number)
    @IsInt()
    limit: number;
}

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class SearchArticleData {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    cursor?: number;

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