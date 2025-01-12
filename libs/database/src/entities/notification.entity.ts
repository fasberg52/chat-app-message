import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { NotificationTypeEnum } from '../enums/notificatoin.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { NotificationItemEntity } from './notification-item.entity';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@Entity({ name: 'notifications', schema: 'notification' })
export class NotificationEntity extends BaseEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar' })
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({ enum: NotificationTypeEnum })
  @IsEnum(NotificationTypeEnum)
  @Column({
    type: 'enum',
    enum: NotificationTypeEnum,
  })
  type: NotificationTypeEnum;

  @ApiProperty()
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @OneToMany(
    () => NotificationItemEntity,
    (notificationItem) => notificationItem.notifications,
  )
  @ApiProperty({ type: () => [NotificationItemEntity] })
  notificationItems: Relation<NotificationItemEntity[]>;
}
