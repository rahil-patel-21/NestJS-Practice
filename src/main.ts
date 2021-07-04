if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidatePipe } from './core/pipes/validator.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  admin.initializeApp({
    credential: admin.credential.cert(
      'nestjs-practice-firebase-adminsdk-m59s7-ce021fec5d.json',
    ),
  });
  app.setGlobalPrefix('/v1');
  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidatePipe());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
