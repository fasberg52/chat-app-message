import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws'; // Importing 'ws' instead of 'socket.io'
import { Injectable } from '@nestjs/common';
import { SendMessageDto } from '@app/shared/dtos/message/send-message.dto';
import { ClientProxy, Client, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { EncryptionService } from '@app/shared/utils/encrypt-data.utils';

@Injectable()
@WebSocketGateway(8080, { cors: { origin: '*' } })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  protected server: Server;

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

  async handleConnection(client: WebSocket) {
    console.log('Client connected:', client.readyState);

    client.on('message', (data: string) => {
      const { username, password } = JSON.parse(data);
      client['data'] = { username, password };
      console.log('Authenticated:', client);
    });
  }

  async handleDisconnect(client: WebSocket) {
    console.log('Client disconnected:', client);
  }

  @SubscribeMessage('sendMessages')
  async handleMessage(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() data: SendMessageDto,
  ): Promise<WsResponse<any>> {
    try {
      console.log('Triggered sendMessage event:', data);

      const dtoInstance = plainToInstance(SendMessageDto, data);
      const errors = await validate(dtoInstance);
      if (errors.length > 0) {
        console.error('Validation errors:', errors);
        throw new WsException('Invalid message data');
      }

     

      let result;
      try {
        result = await firstValueFrom(
          this.messageServiceClient.send('messages.sendMessages', {
            content: data.content,
            receiverId: data.receiverId,
            type: data.type,
          }),
        );
      } catch (err) {
        console.error('err:', err);
        throw new WsException('Error sending message to the service');
      }

      if (!result) {
        throw new WsException('Error processing the message');
      }

      this.server.clients.forEach((ws) => {
        ws.send(JSON.stringify({ event: 'sendMessage', data: result }));
      });

      return { event: 'sendMessage', data: result };
    } catch (err) {
      console.error('err:', err);
      throw new WsException('An error occurred while sending the message');
    }
  }

  @SubscribeMessage('messages.getMessages')
  async getMessages(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() receiverId: number,
  ) {
    const userId = client['data']?.userId;
    console.log('getMessages', userId, receiverId);

    const result = await this.messageServiceClient
      .send('getMessages', {
        userId,
        receiverId,
      })
      .toPromise();

    client.send(JSON.stringify({ event: 'getMessages', data: result }));

    return result;
  }
}
