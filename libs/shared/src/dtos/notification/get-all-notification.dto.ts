import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../paginate/pagination.dto';
import { IsBoolean, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { NotificationTypeEnum } from '@app/database/enums/notificatoin.enum';
import { Transform, Type } from 'class-transformer';

export class GetNotificationsDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: NotificationTypeEnum,
    default: NotificationTypeEnum.PUBLIC,
  })
  @IsEnum(NotificationTypeEnum)
  @IsOptional()
  @Transform(({ value }) => value.trim())
  type: NotificationTypeEnum;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @Type(() => String)
  search: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @Type(() => Boolean)
  isRead: boolean;

  @ApiPropertyOptional({ default: 'DESC' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @IsIn(['ASC', 'DESC'])
  @Type(() => String)
  sort: string;

  @ApiPropertyOptional({ default: 'createdAt' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @Type(() => String)
  sortBy: string;
}
