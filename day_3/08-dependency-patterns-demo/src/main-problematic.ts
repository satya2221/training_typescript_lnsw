import { NestFactory } from '@nestjs/core';
import { AppProblematicModule } from './app-problematic.module';

/**
 * PROBLEMATIC VERSION BOOTSTRAP
 *
 * This bootstrap uses the problematic module with circular dependencies.
 * WARNING: This will likely fail at runtime due to circular dependency injection!
 *
 * Run with: npx ts-node src/main-problematic.ts
 */
async function bootstrap() {
  try {
    console.log('⚠️  Starting PROBLEMATIC version...');
    console.log('🚨 This version has circular dependencies and may fail!');

    const app = await NestFactory.create(AppProblematicModule);
    await app.listen(3000);

    console.log('🤔 Somehow it worked... (This is unexpected!)');
    console.log('✅ Application running on http://localhost:3000');
  } catch (error) {
    console.error('❌ FAILED as expected due to circular dependencies:');
    console.error(error.message);
    console.log('\n💡 Solution: Use the working version instead:');
    console.log('   npx ts-node src/main-working.ts');
    process.exit(1);
  }
}

bootstrap();