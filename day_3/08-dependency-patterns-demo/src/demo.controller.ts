import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BusinessLogicService } from './solutions/business-logic.service';

@Controller('demo')
export class DemoController {
  constructor(
    private readonly businessLogic: BusinessLogicService,
  ) {}

  @Post('users')
  async createUser(@Body() userData: { name: string; email: string }) {
    return this.businessLogic.createUserWithOrderCheck(userData);
  }

  @Post('orders')
  async createOrder(@Body() orderData: { userId: number; amount: number }) {
    return this.businessLogic.createOrderWithValidation(orderData.userId, orderData.amount);
  }

  @Post('users/:id/deactivate')
  async deactivateUser(@Param('id') userId: string) {
    await this.businessLogic.deactivateUserWithOrderCancellation(parseInt(userId));
    return { message: `User ${userId} deactivated and orders cancelled` };
  }

  @Get('orders/:id/with-user')
  async getOrderWithUser(@Param('id') orderId: string) {
    return this.businessLogic.getOrderWithUserInfo(parseInt(orderId));
  }

  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      message: 'Circular dependency demo is running without circular dependencies!',
      timestamp: new Date().toISOString(),
    };
  }
}