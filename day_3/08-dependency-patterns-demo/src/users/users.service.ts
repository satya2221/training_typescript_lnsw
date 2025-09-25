import { Injectable, Inject } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface User {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
}

// PROBLEMATIC: This creates a circular dependency with OrdersService
@Injectable()
export class UsersService {
  constructor(
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

    // This will cause circular dependency because OrdersService also depends on UsersService
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
      // Cancel all pending orders when user becomes inactive
      await this.ordersService.cancelUserOrders(userId);
    }
  }
}
