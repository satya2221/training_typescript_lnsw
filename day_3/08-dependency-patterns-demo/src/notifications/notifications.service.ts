import { Injectable } from '@nestjs/common';
import { User } from '../users/users.service';
import { Order } from '../orders/orders.service';

@Injectable()
export class NotificationsService {
  async sendWelcomeNotification(user: User): Promise<void> {
    console.log(`Sending welcome notification to ${user.email}`);
  }

  async sendOrderConfirmation(user: User, order: Order): Promise<void> {
    console.log(`Sending order confirmation to ${user.email} for order ${order.id}`);
  }

  async sendOrderCancellationNotification(user: User): Promise<void> {
    console.log(`Sending order cancellation notification to ${user.email}`);
  }

  async sendEmailNotification(email: string, subject: string, body: string): Promise<void> {
    console.log(`Email sent to ${email}: ${subject}`);
  }
}
