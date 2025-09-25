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

  const port = process.env.PORT || 3007;
  await app.listen(port);

  console.log('🚀 Query Optimization Demo running on:', `http://localhost:${port}`);
  console.log('📊 Info endpoint:', `http://localhost:${port}/info`);
  console.log('🐌 Bad queries:', `http://localhost:${port}/bad/all`);
  console.log('⚡ Optimized queries:', `http://localhost:${port}/optimized/all`);
  console.log('🏁 Benchmark:', `http://localhost:${port}/benchmark/full`);
  console.log('⚠️  NOTE: Run seeding first: npx ts-node src/seeds/large-dataset.seed.ts');
}
bootstrap();
