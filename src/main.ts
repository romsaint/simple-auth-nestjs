import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser'
import { ValidationPipe, VersioningType } from '@nestjs/common';
import {CONFIG} from './config'


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe())
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v'
  })
  app.use(cookieParser(CONFIG.COOKIE_SECRET))
  app.setViewEngine('pug');
  app.setGlobalPrefix('api')

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
