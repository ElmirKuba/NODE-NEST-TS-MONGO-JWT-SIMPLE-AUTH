import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

import environment from './environments/environment';
import { INestApplication } from '@nestjs/common';

const PORT: number = environment.PORT || 3000;

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create<INestApplication>(
    AppModule,
    {
      cors: true,
    },
  );

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  await app.listen(PORT, (): void => {
    console.log(`Service start and listening on port ${PORT}`);
  });
}
bootstrap();
