import { Module, forwardRef } from '@nestjs/common';
import { UsersFixedService } from './users-fixed.service';
import { OrdersService } from './orders-fixed.service';
import { NotificationsModule } from '../notifications/notifications.module';

// SOLUTION 1: Using forwardRef in module imports
@Module({
  imports: [NotificationsModule],
  providers: [
    UsersFixedService,
    OrdersService,
  ],
  exports: [UsersFixedService, OrdersService],
})
export class FixedModule {}