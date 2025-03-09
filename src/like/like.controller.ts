import { Body, Controller, Delete, Injectable, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { UseAuth } from "src/common/decorators/user.auth.decorator";
import { LikeData } from "./dtos/like.dto";
import { LikeService } from "./like.service";

@Controller('article')
export class LikeController {
    constructor(
        private readonly likeService: LikeService,
    ){}

    @Put(':articleId/like')
    @UseAuth()
    async like(
        @Body() likeData: LikeData, 
        @Param('articleId', ParseIntPipe) articleId: number
    ) {
        await this.likeService.addLike(Number(likeData.userId), articleId);
    }

    @Delete(':articleId/like')
    @UseAuth()
    async unlike(
        @Body() likeData: LikeData, 
        @Param('articleId', ParseIntPipe) articleId: number
    ) {
        await this.likeService.removeLike(Number(likeData.userId), articleId);
    }
}