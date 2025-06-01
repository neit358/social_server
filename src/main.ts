import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
// import { otelSDK } from './tracing';
import * as dotenv from 'dotenv';
dotenv.config();

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
  console.log('Starting Social API...');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  console.log('Social API started successfully');
  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });

  console.log('Setting up static assets...');
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  console.log('Setting up Swagger...');
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

  console.log('Swagger setup complete');

  // set cookie parser
  app.use(cookieParser());

  console.log('Setting up body parsers...');
  app.use(express.json({ limit: '2gb' }));
  app.use(express.urlencoded({ extended: true, limit: '2gb' }));

  console.log('Body parsers setup complete');
  await app.listen(process.env.PORT || 3001);
  console.log(`Social API is running on: ${await app.getUrl()}`);
}
bootstrap();
