import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SendMessageDto } from '@app/shared/dtos/message/send-message.dto';
import { firstValueFrom } from 'rxjs';
import { EncryptionService } from '@app/shared/utils/encrypt-data.utils';
import { SuccessResponse } from '@app/common/responses/base.response';
import { UserEntity, UserRoleEunm } from '@app/database';
import { User } from '@app/common';
import { Roles } from '@app/common/decorators/role.decorator';
import { GetMessageDto } from '@app/shared/dtos/message/get-message.dto';
import { MessagesListResponse } from '../../responses/message/message.response';

@Controller('messages')
@ApiTags('Messages')
@ApiBearerAuth()
export class MessageController {
  @Client({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      queue: process.env.MESSAGING_SERVICE_HOST,
      queueOptions: {
        durable: false,
      },
    },
  })
  private messageServiceClient: ClientProxy;

  constructor(private readonly encryptionService: EncryptionService) {}

  @ApiOkResponse(SuccessResponse.getApiDoc())
  @Roles(UserRoleEunm.USER, UserRoleEunm.ADMIN)
  @Post('send')
  async sendMessage(
    @Body() data: SendMessageDto,
    @User() user: UserEntity,
  ): Promise<SuccessResponse> {
    try {
      const userId = user?.id;
      const hashedMessage = await this.encryptionService.encryptMessage(
        data.content,
      );
      let result;
      try {
        result = await firstValueFrom(
          this.messageServiceClient.send('messages.sendMessage', {
            content: hashedMessage,
            senderId: userId,
            receiverId: data.receiverId,
            type: data.type,
          }),
        );
      } catch (err) {
        console.error('Error in message service call:', err);
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (!result) {
        throw new HttpException(
          'Error processing the message',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return new SuccessResponse();
    } catch (err) {
      console.error('error:', err);
      throw new HttpException(
        'An error occurred while sending the message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOkResponse(MessagesListResponse.getApiDoc())
  @Post('get')
  async getMessages(
    @Body() dto: GetMessageDto,
    @User() user: UserEntity,
  ): Promise<MessagesListResponse> {
    try {
      console.log('Fetching messages for user:', user.id);

      const [result, count] = await firstValueFrom(
        this.messageServiceClient.send('messages.getMessages', {
          senderId: dto.senderId,
          receiverId: user.id,
          page: dto.page,
          limit: dto.limit,
        }),
      );

      const decryptedMessages = await Promise.all(
        result.map(async (message) => ({
          ...message,
          content: await this.encryptionService.decryptMessage(message.content),
        })),
      );

      return new MessagesListResponse(decryptedMessages, count);
    } catch (error) {
      console.error('Error in getMessages:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
