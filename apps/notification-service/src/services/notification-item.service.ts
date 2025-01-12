import { Injectable } from '@nestjs/common';
import { NotificationItemRepository } from '../repositorires/notification-item.repository';
import { CreateNotificationItemDto } from '@app/shared';

@Injectable()
export class NotificationItemService {
  constructor(
    private readonly notificationItemRepository: NotificationItemRepository,
  ) {}

  async createNotificationItem(dto: CreateNotificationItemDto) {
    const notificationItem = await this.notificationItemRepository.create({
      userId: dto.userId,
      notificationId: dto.notificationId,
      isRead: dto.isRead,
    });
    await this.notificationItemRepository.save(notificationItem);
    return notificationItem;
  }
}
