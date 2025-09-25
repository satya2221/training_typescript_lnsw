import { Injectable } from '@nestjs/common';
import { UsersService, User } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface Order {
  id: number;
  userId: number;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

// PROBLEMATIC: This creates a circular dependency with UsersService
@Injectable()
export class OrdersService {
  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createOrder(userId: number, amount: number): Promise<Order> {
    // This creates circular dependency because UsersService also depends on OrdersService
    const user = await this.usersService.getUser(userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    const order: Order = {
      id: Math.floor(Math.random() * 1000),
      userId,
      amount,
      status: 'pending',
      createdAt: new Date(),
    };

    // Send order confirmation
    await this.notificationsService.sendOrderConfirmation(user, order);

    return order;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return [
      {
        id: 1,
        userId,
        amount: 100.00,
        status: 'completed',
        createdAt: new Date(),
      },
      {
        id: 2,
        userId,
        amount: 50.00,
        status: 'pending',
        createdAt: new Date(),
      },
    ];
  }

  async cancelUserOrders(userId: number): Promise<void> {
    console.log(`Cancelling all orders for user ${userId}`);

    const user = await this.usersService.getUser(userId);
    if (user) {
      await this.notificationsService.sendOrderCancellationNotification(user);
    }
  }

  async getOrderWithUser(orderId: number): Promise<{ order: Order; user: User } | null> {
    const order: Order = {
      id: orderId,
      userId: 1,
      amount: 100.00,
      status: 'pending',
      createdAt: new Date(),
    };

    // Another circular dependency usage
    const user = await this.usersService.getUser(order.userId);

    return user ? { order, user } : null;
  }
}
