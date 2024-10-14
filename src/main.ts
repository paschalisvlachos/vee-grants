import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as multer from 'multer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    multer({
      dest: './uploads',
    }).single('file'),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors = []) => {
        return new BadRequestException(validationErrors);
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
