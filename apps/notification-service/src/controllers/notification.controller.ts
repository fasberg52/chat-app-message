import { Controller } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateNotificationDto,
  CreateNotificationPrivateAdminDto,
} from '@app/shared/dtos/notification/create-notification.dto';
import { GetNotificationsDto } from '@app/shared/dtos/notification/get-all-notification.dto';
import { DeleteNotificationDto } from '@app/shared/dtos/notification/delete-notifcation.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('notification.create.public')
  async createNotification(@Payload() data: CreateNotificationDto) {
    return this.notificationService.createNotificationPublicAdmin(data);
  }

  @MessagePattern('notification.create.private')
  async createNotificationPrivateAdmin(
    @Payload() data: CreateNotificationPrivateAdminDto,
  ) {
    return this.notificationService.createNotificationPrivateAdmin(data);
  }

  @MessagePattern('notification.get')
  async getNotification(@Payload() data: GetNotificationsDto) {
    return this.notificationService.getNotifications(data);
  }

  @MessagePattern('notification.delete')
  async deleteNotification(@Payload() data: DeleteNotificationDto) {
    return this.notificationService.deleteNotification(data.id);
  }

  @MessagePattern('notification.getById')
  async getNotificationById(@Payload() id: number) {
    return this.notificationService.getNotificationById(id);
  }
}
