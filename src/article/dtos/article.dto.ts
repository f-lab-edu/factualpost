import { PickType } from "@nestjs/mapped-types";
import { Transform, Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Article } from "src/entities/Article";

export class ArticleDto extends PickType(Article, ['title', 'contents'] as const) {
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

export class RemoveArticle extends PickType(Article, ['id'] as const) {
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