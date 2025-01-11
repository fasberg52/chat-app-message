import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from '@app/database/entities/message.entity';
import { CreateMessageDto } from '@app/shared/dtos/message/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async createMessage(data: CreateMessageDto): Promise<MessageEntity> {
    const newMessage = {
      ...data,
      createdAt: new Date(),
    };
    const message = this.messageRepository.create(newMessage);
    return this.messageRepository.save(message);
  }

  async getMessages(
    userId: number,
    receiverId: number,
  ): Promise<MessageEntity[]> {
    return this.messageRepository.find({
      where: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
      order: {
        createdAt: 'ASC',
      },
      relations: ['sender', 'receiver'],
    });
  }
}
