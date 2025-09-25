import { NestFactory } from '@nestjs/core';
import { AppWorkingModule } from './app-working.module';

/**
 * WORKING VERSION BOOTSTRAP
 *
 * This bootstrap uses the working module with clean architecture.
 * Run with: npx ts-node src/main-working.ts
 */
async function bootstrap() {
  const app = await NestFactory.create(AppWorkingModule);

  console.log('🚀 Starting WORKING version (Clean Architecture)...');
  console.log('📊 This version has NO circular dependencies!');

  await app.listen(3000);

  console.log('✅ Application running on http://localhost:3000');
  console.log('🔍 Test: curl http://localhost:3000/demo/health');
}

bootstrap();