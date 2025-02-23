import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/auth/auth.guard";
import { ArticleDto, CreateAritlce, RemoveArticle } from "./dtos/article.dto";
import { ArticleService } from "./article.service";
import { GetUser } from "src/common/decorators/user.param.decorator";
import { UserProfile } from "src/user/dtos/user.dto";

@Controller('article')
export class ArticleController {

    constructor(
        private readonly articleService: ArticleService,
    ){}

    @Post()
    @UseGuards(JwtAuthGuard)
    async write(@Body() articleData: CreateAritlce) {
        const articleId = await this.articleService.write(articleData);
        return { location: articleId };
    }

    @Delete('/:articleId')
    @UseGuards(JwtAuthGuard)
    async remove(
        @GetUser() user: UserProfile,
        @Param('articleId', ParseIntPipe) articleId: number
    ) {
        await this.articleService.remove(user.id, articleId);
    }

}
