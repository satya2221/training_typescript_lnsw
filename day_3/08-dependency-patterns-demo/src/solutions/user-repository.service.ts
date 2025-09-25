import { Injectable } from '@nestjs/common';
import { User } from './users-fixed.service';

// SOLUTION 2: Repository Pattern - Pure data access without business logic
@Injectable()
export class UserRepositoryService {
  async findById(id: number): Promise<User | null> {
    return {
      id,
      email: `user${id}@example.com`,
      name: `User ${id}`,
      isActive: true,
      createdAt: new Date(),
    };
  }

  async findByIds(ids: number[]): Promise<User[]> {
    return ids.map(id => ({
      id,
      email: `user${id}@example.com`,
      name: `User ${id}`,
      isActive: true,
      createdAt: new Date(),
    }));
  }

  async create(userData: Partial<User>): Promise<User> {
    return {
      id: Math.floor(Math.random() * 1000),
      email: userData.email || '',
      name: userData.name || '',
      isActive: true,
      createdAt: new Date(),
    };
  }

  async updateActivity(userId: number, isActive: boolean): Promise<void> {
    console.log(`User ${userId} activity updated to ${isActive}`);
  }
}