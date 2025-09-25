import { Module } from '@nestjs/common';
import { UserRepositoryService } from './user-repository.service';
import { OrderRepositoryService } from './order-repository.service';
import { BusinessLogicService } from './business-logic.service';
import { NotificationsModule } from '../notifications/notifications.module';

// SOLUTION 2: Clean Architecture - No circular dependencies
// Repository layer -> Business Logic layer -> Controller layer
@Module({
  imports: [NotificationsModule],
  providers: [
    // Repository layer (data access)
    UserRepositoryService,
    OrderRepositoryService,

    // Business logic layer (orchestration)
    BusinessLogicService,
  ],
  exports: [
    UserRepositoryService,
    OrderRepositoryService,
    BusinessLogicService,
  ],
})
export class CleanArchitectureModule {}