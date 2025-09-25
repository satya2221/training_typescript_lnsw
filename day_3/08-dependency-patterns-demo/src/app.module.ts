import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { NotificationsModule } from './notifications/notifications.module';

/**
 * CIRCULAR DEPENDENCY DEMO MODULE
 *
 * This module INTENTIONALLY demonstrates circular dependency problems!
 *
 * To see the working solution, check:
 * - src/app-working.module.ts (Clean Architecture solution)
 * - src/solutions/ folder (All fixed implementations)
 *
 * Run `npm run check:circular` to see the detected circular dependencies.
 *
 * WARNING: This module will likely fail to start due to circular dependencies!
 * Use app-working.module.ts for a functional demo.
 */

@Module({
  // PROBLEMATIC VERSION: This creates circular dependencies
  imports: [UsersModule, OrdersModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
