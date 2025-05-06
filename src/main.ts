import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  const config = new DocumentBuilder()
    .setTitle('Social API')
    .setDescription('The social API description')
    .setVersion('1.0')
    .addTag('social')
    // .addBearerAuth() // Use JWT authentication
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
