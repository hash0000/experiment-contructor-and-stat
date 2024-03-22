import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { AppModule } from './modules/app/app.module';

async function app() {
  const port = process.env.APP_PORT || 3320;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('experiment-constructor-and-stat')
    .setVersion('0.0.1')
    .setContact('hash0', 'https://github.com/hash0000', 'hash00000@icloud.com')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });
  await app.listen(port);
}

app()
  .then(() => {
    console.log(`App started on: ${process.env.APP_PORT}.`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
