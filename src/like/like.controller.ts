import { Body, Controller, Delete, Injectable, Param, ParseIntPipe, Post } from "@nestjs/common";
import { UseAuth } from "src/common/decorators/user.auth.decorator";
import { LikeData } from "./dtos/like.dto";
import { LikeService } from "./like.service";

@Controller('article')
export class LikeController {
    constructor(
        private readonly likeService: LikeService,
    ){}

    @Post(':articleId/like')
    @UseAuth()
    async toggleLike(
        @Body() likeData: LikeData, 
        @Param('articleId', ParseIntPipe) articleId: number
    ) {
        await this.likeService.toggleLike(Number(likeData.userId), articleId);
    }

}