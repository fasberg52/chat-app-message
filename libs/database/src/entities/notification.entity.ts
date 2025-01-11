import {  Column, Entity, OneToMany, Relation } from 'typeorm';
import { NotificationTypeEnum } from '../enums/notificatoin.enum';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base.entity';
import { NotificationItemEntity } from './notification-item.entity';

@Entity({ name: 'notifications', schema: 'notification' })
export class NotificationEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column('enum', {
    enum: NotificationTypeEnum,
  })
  type: NotificationTypeEnum;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @OneToMany(
    () => NotificationItemEntity,
    (notificationItem) => notificationItem.notifications,
  )
  @ApiProperty({ type: () => [NotificationItemEntity] })
  notificationItems: Relation<NotificationItemEntity[]>;
}
