import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { UserEntity } from './user.entity';
import { MessageTypeEnum } from '../enums/message.enum';

@Entity({ schema: 'message', name: 'messages' })
export class MessageEntity extends BaseEntity {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Column({ type: 'int8' })
  senderId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Column({ type: 'int8' })
  receiverId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'text' })
  content: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsBoolean()
  // @Column({ type: 'boolean', default: false })
  // isRead: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum({ type: MessageTypeEnum, default: MessageTypeEnum.TEXT })
  @Column({
    type: 'enum',
    enum: MessageTypeEnum,
    default: MessageTypeEnum.TEXT,
  })
  type: MessageTypeEnum;

  @DeleteDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  deletedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  @JoinColumn({ name: 'senderId' })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  @JoinColumn({ name: 'receiverId' })
  receiver: UserEntity;
}
