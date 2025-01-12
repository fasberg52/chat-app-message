import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';
import { NotificationTypeEnum } from '@app/database/enums/notificatoin.enum';
import { IsEnum } from 'class-validator';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @ApiProperty()
  @IsEnum(NotificationTypeEnum)
  type: NotificationTypeEnum;
}
