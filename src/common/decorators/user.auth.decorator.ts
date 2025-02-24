import { applyDecorators, UseGuards, UsePipes } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.guard";
import { AttachUserPipe } from "../pipes/attach.user.pipe";

export function UseAuth() {
    return applyDecorators(
        UseGuards(JwtAuthGuard),
        UsePipes(AttachUserPipe)
    );
}