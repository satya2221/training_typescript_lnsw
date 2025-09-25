import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemoController } from './demo.controller';
import { CleanArchitectureModule } from './solutions/clean-architecture.module';
import { FixedModule } from './solutions/fixed.module';

// WORKING VERSION: Uses clean architecture without circular dependencies
@Module({
  imports: [
    CleanArchitectureModule, // Solution 2: Clean Architecture
    FixedModule,            // Solution 1: forwardRef() patterns
  ],
  controllers: [AppController, DemoController],
  providers: [AppService],
})
export class AppWorkingModule {}