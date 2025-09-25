import { Injectable } from '@nestjs/common';
import { Order } from './orders-fixed.service';

// SOLUTION 2: Repository Pattern - Pure data access without business logic
@Injectable()
export class OrderRepositoryService {
  async findByUserId(userId: number): Promise<Order[]> {
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

  async findById(id: number): Promise<Order | null> {
    return {
      id,
      userId: 1,
      amount: 100.00,
      status: 'pending',
      createdAt: new Date(),
    };
  }

  async create(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    return {
      id: Math.floor(Math.random() * 1000),
      ...orderData,
      createdAt: new Date(),
    };
  }

  async cancelByUserId(userId: number): Promise<void> {
    console.log(`Cancelling all orders for user ${userId}`);
  }
}