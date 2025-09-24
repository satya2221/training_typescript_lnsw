import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Inventory API')
        .setDescription('API documentation for the Inventory Management system')
        .setVersion('1.0')
        .addTag('products')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document); // UI Swagger akan tersedia di /api-docs

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
}
bootstrap();
