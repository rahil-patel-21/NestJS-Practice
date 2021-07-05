if (!process.env.IS_TS_NODE) require('module-alias/register');

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import * as admin from 'firebase-admin';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidatePipe } from '@core/pipes/validator.pipe';

async function backendService() {
  const app = await NestFactory.create(AppModule);
  admin.initializeApp({
    credential: admin.credential.cert(process.env.FIREBASE_KEY_PATH),
  });
  app.setGlobalPrefix('/v1');
  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidatePipe());
  await app.listen(process.env.PORT || 3000);
}
backendService();
