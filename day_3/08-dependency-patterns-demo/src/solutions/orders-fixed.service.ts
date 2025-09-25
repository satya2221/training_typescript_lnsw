import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersFixedService, User } from './users-fixed.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface Order {
  id: number;
  userId: number;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

// SOLUTION 1: Using forwardRef to resolve circular dependency
@Injectable()
export class OrdersService {
  constructor(
    @Inject(forwardRef(() => UsersFixedService))
    private readonly usersService: UsersFixedService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createOrder(userId: number, amount: number): Promise<Order> {
    // This now works with forwardRef
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

    // This now works with forwardRef
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

    // This now works with forwardRef
    const user = await this.usersService.getUser(order.userId);

    return user ? { order, user } : null;
  }
}