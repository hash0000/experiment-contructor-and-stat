import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { AppStatisticModule } from './modules/appStatistic/appStatistic.module';

async function appStatistic() {
  const port = process.env.APP_STATISTIC_PORT || 3321;
  const app = await NestFactory.create(AppStatisticModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('experiment-constructor-and-stat')
    .setVersion('0.0.1')
    .setContact('Nikita Mosin', 'https://github.com/hash0000', 'hash00000@icloud.com')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  await app.listen(port);
}

appStatistic()
  .then(() => {
    console.log(`App (stat) started on: ${process.env.APP_STATISTIC_PORT}.`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
