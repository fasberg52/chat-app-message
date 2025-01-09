import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserEntity } from './user.entity';

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

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isRead: boolean;

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
