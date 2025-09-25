import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders-fixed.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface User {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
}

// SOLUTION 1: Using forwardRef to resolve circular dependency
@Injectable()
export class UsersFixedService {
  constructor(
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createUser(userData: Partial<User>): Promise<User> {
    const user: User = {
      id: Math.floor(Math.random() * 1000),
      email: userData.email || '',
      name: userData.name || '',
      isActive: true,
      createdAt: new Date(),
    };

    // This now works with forwardRef
    const userOrders = await this.ordersService.getUserOrders(user.id);
    console.log(`User ${user.name} has ${userOrders.length} orders`);

    // Send welcome notification
    await this.notificationsService.sendWelcomeNotification(user);

    return user;
  }

  async getUser(id: number): Promise<User | null> {
    return {
      id,
      email: `user${id}@example.com`,
      name: `User ${id}`,
      isActive: true,
      createdAt: new Date(),
    };
  }

  async getUsersByIds(ids: number[]): Promise<User[]> {
    return ids.map(id => ({
      id,
      email: `user${id}@example.com`,
      name: `User ${id}`,
      isActive: true,
      createdAt: new Date(),
    }));
  }

  async updateUserActivity(userId: number, isActive: boolean): Promise<void> {
    console.log(`User ${userId} activity updated to ${isActive}`);

    if (!isActive) {
      // This now works with forwardRef
      await this.ordersService.cancelUserOrders(userId);
    }
  }
}