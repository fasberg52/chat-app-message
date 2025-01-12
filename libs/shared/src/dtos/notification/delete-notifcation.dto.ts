import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteNotificationDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
