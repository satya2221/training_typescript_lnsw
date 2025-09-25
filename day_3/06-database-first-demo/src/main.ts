import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  const port = process.env.PORT || 3006;
  await app.listen(port);

  console.log('🚀 Database-First Demo running on:', `http://localhost:${port}`);
  console.log('📊 Comparison Report:', `http://localhost:${port}/comparison`);
  console.log('🔧 TypeORM Entities:', `http://localhost:${port}/typeorm/entities`);
  console.log('🔧 Prisma Schema:', `http://localhost:${port}/prisma/schema`);
}
bootstrap();
