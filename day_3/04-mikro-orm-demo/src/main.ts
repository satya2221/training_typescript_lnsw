import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for development
  app.enableCors();
  
  const port = process.env.PORT || 3004;
  await app.listen(port);
  
  console.log(`🚀 Mikro-ORM Demo API running on http://localhost:${port}`);
  console.log(`📊 Advanced features: Unit of Work, Identity Map, Optimistic Locking`);
}
bootstrap();
