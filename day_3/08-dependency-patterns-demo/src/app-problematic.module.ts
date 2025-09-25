import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { NotificationsModule } from './notifications/notifications.module';

// PROBLEMATIC VERSION: This will cause circular dependency errors at runtime
@Module({
  imports: [UsersModule, OrdersModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppProblematicModule {}