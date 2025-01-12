import { NotificationEntity } from '@app/database';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateNotificationDto extends PickType(NotificationEntity, [
  'title',
  'description',
] as const) {}

export class CreateNotificationPrivateAdminDto extends CreateNotificationDto {
  @ApiProperty()
  @IsNumber()
  userId: number;
}
