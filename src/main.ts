import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import redConfigFile from './utils/redConfigFile';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.setGlobalPrefix('/api');

  const configYml: any = redConfigFile();

  //配置静态文件访问目录
  app.useStaticAssets(join(__dirname, '../../', 'uploadFiles'), {
    prefix: configYml.PREFIX, // 可选，设置访问前缀
  });

  // swagger配置
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      // 去除前端传递dto上没有的字段
      whitelist: true,
    }),
  );

  await app.listen(configYml.PORT);
}
bootstrap();
