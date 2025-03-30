import { PickType } from "@nestjs/mapped-types";
import { IsInt } from "class-validator";
import { Like } from "src/entities/Like";


export class LikeDto extends PickType(Like, []) {

}

export class LikeData extends LikeDto {
    id: number;
    userId: string;
}

export class LikeUserDto {
    id: number;
}

export class LikeArticleDto {
    id: number;
}

export class ToggleLikeDto {
    user: LikeUserDto;
    article: LikeArticleDto;
}

export class LikeRequestDto {
    userId: number;
    articleId: number;
}