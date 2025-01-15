import { Controller } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { GetMessageDto } from '@app/shared/dtos/message/get-message.dto';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @MessagePattern('messages.getMessages')
  async getMessages(@Payload() data: GetMessageDto, receiverId: number) {
    return this.messageService.getMessages(
      data.senderId,
      receiverId,
      data.page,
      data.limit,
    );
  }

  @MessagePattern('messages.sendMessage')
  async handleMessage(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      console.log(`payload: ${JSON.stringify(data)}`);
      await this.messageService.createMessage(data);
      channel.ack(originalMsg);
      return { status: 'success', data: data };
    } catch (error) {
      console.error('Message processing error:', error);
      channel.nack(originalMsg);
    }
  }
}
