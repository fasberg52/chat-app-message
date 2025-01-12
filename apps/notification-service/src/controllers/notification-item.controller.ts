import { Controller } from '@nestjs/common';
import { NotificationItemService } from '../services/notification-item.service';

@Controller('notifications-items')
export class NotificationItemController {
  constructor(
    private readonly notificationItemService: NotificationItemService,
  ) {}
}
