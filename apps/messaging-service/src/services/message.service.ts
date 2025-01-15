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
    senderId: number,
    receiverId: number,
    page: number,
    limit: number,
  ): Promise<[MessageEntity[], number]> {
    const [result, count] = await this.messageRepository.findAndCount({
      where: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
      order: {
        createdAt: 'DESC',
      },

      select: {
        id: true,
        senderId: true,
        receiverId: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return [result, count];
  }
}
