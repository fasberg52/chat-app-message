import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class CreateNotificationItemDto {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNumber()
  notificationId: number;

  @ApiProperty()
  @IsBoolean()
  isRead: boolean;
}
