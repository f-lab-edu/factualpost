import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes } from "@nestjs/common";
import { CreateArticle, UpdateArticle } from "./dtos/article.dto";
import { ArticleService } from "./article.service";
import { GetUser } from "src/common/decorators/user.param.decorator";
import { UserProfile } from "src/user/dtos/user.dto";
import { UseAuth } from "src/common/decorators/user.auth.decorator";

@Controller('article')
export class ArticleController {

    constructor(
        private readonly articleService: ArticleService,
    ){}

    @Post()
    @UseAuth()
    async write(@Body() articleData: CreateArticle) {
        const articleId = await this.articleService.write(articleData);
        return { location: articleId };
    }

    @Patch('/:articleId')
    @UseAuth()
    async update(
        @Body() articleData: UpdateArticle, 
        @Param('articleId', ParseIntPipe) articleId: number,
    ) {
        await this.articleService.update(articleData, articleId);
        return { location: articleId };
    }

    @Delete('/:articleId')
    @UseAuth()
    async remove(
        @GetUser() user: UserProfile,
        @Param('articleId', ParseIntPipe) articleId: number
    ) {
        await this.articleService.remove(user.id, articleId);
    }
}
