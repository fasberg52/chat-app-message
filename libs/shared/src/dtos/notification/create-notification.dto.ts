import { NotificationEntity } from '@app/database';
import { PickType } from '@nestjs/swagger';

export class CreateNotificationDto extends PickType(NotificationEntity, [
  'title',
  'description',
  'type',
] as const) {}
