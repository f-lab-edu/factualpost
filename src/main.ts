import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { JwtInterceptor } from './common/auth/auth.interceptor';
import { AttachUserInterceptor } from './common/interceptor/attach.user.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(morgan('dev'));
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  app.useGlobalInterceptors(
    new AttachUserInterceptor(), 
    new JwtInterceptor()
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4445;

  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
