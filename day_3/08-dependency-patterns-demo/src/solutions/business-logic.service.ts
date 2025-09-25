import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from './user-repository.service';
import { OrderRepositoryService } from './order-repository.service';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from './users-fixed.service';
import { Order } from './orders-fixed.service';

// SOLUTION 2: Business Logic Service - Orchestrates operations without circular dependencies
@Injectable()
export class BusinessLogicService {
  constructor(
    private readonly userRepository: UserRepositoryService,
    private readonly orderRepository: OrderRepositoryService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // User creation with order checking
  async createUserWithOrderCheck(userData: Partial<User>): Promise<User> {
    const user = await this.userRepository.create(userData);

    // Check existing orders without circular dependency
    const userOrders = await this.orderRepository.findByUserId(user.id);
    console.log(`User ${user.name} has ${userOrders.length} orders`);

    // Send welcome notification
    await this.notificationsService.sendWelcomeNotification(user);

    return user;
  }

  // Order creation with user validation
  async createOrderWithValidation(userId: number, amount: number): Promise<Order> {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    const order = await this.orderRepository.create({
      userId,
      amount,
      status: 'pending',
    });

    // Send order confirmation
    await this.notificationsService.sendOrderConfirmation(user, order);

    return order;
  }

  // User deactivation with order cancellation
  async deactivateUserWithOrderCancellation(userId: number): Promise<void> {
    await this.userRepository.updateActivity(userId, false);
    await this.orderRepository.cancelByUserId(userId);

    const user = await this.userRepository.findById(userId);
    if (user) {
      await this.notificationsService.sendOrderCancellationNotification(user);
    }
  }

  // Get complete order information
  async getOrderWithUserInfo(orderId: number): Promise<{ order: Order; user: User } | null> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) return null;

    const user = await this.userRepository.findById(order.userId);
    if (!user) return null;

    return { order, user };
  }
}