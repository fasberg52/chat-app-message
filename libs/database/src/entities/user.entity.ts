import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { MessageEntity } from './message.entity';
import { UserRoleEunm } from '../enums/role.enum';
import { NotificationItemEntity } from './notification-item.entity';

@Entity({ schema: 'user', name: 'users' })
export class UserEntity extends BaseEntity {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Min(3)
  @Max(255)
  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Min(3)
  @Max(255)
  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @ApiProperty()
  @IsEnum({ type: UserRoleEunm, default: UserRoleEunm.USER })
  @Column({ type: 'enum', enum: UserRoleEunm, default: UserRoleEunm.USER })
  role: UserRoleEunm;

  @OneToMany(() => MessageEntity, (message) => message.sender)
  messages: MessageEntity[];

  @OneToMany(() => MessageEntity, (message) => message.receiver)
  receivedMessages: MessageEntity[];

  @OneToMany(
    () => NotificationItemEntity,
    (notificationItem) => notificationItem.users,
  )
  notificationItems: Relation<NotificationItemEntity>;
}
