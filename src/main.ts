import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
// import { otelSDK } from './tracing';

async function bootstrap() {
  // otelSDK.start();

  // const app = await NestFactory.createMicroservice<NestExpressApplication>(AppModule, {
  //   transport: Transport.TCP,
  //   options: {
  //     host: process.env.MICROSERVICE_HOST,
  //     port: process.env.MICROSERVICE_PORT,
  //   },
  // });
  // await app.listen();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  const config = new DocumentBuilder()
    .setTitle('Social API')
    .setDescription('The social API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  // set cookie parser
  app.use(cookieParser());

  app.use(express.json({ limit: '2gb' }));
  app.use(express.urlencoded({ extended: true, limit: '2gb' }));

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
