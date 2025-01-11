import { Controller } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateMessageDto } from '@app/shared/dtos/message/create-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @MessagePattern('messages.getMessages')
  async getMessages(@Payload() data: any) {
    return this.messageService.getMessages(data.userId, data.receiverId);
  }

  @MessagePattern('messages.sendMessage')
  async handleMessage(data: any) {
    console.log('Received message:', data);
    return { status: 'success', data: data };
  }
}
