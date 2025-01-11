import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  ManyToOne,
  Relation,
  JoinColumn,

} from 'typeorm';
import { NotificationEntity } from './notification.entity';
import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'notificationItems', schema: 'notification' })
export class NotificationItemEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  userId: number;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'int', nullable: false })
  notificationId: number;

  @ManyToOne(
    () => NotificationEntity,
    (notifications: NotificationEntity) => notifications.notificationItems,
  )
  @JoinColumn({ name: 'notificationId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => NotificationEntity })
  notifications: Relation<NotificationEntity>;

  @ManyToOne(() => UserEntity, (user) => user.notificationItems, {
    cascade: true,
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => UserEntity })
  users: Relation<UserEntity>;
}
