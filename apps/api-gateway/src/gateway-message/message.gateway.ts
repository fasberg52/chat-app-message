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
import { Server, WebSocket } from 'ws';
import { Injectable, UseGuards } from '@nestjs/common';
import { SendMessageDto } from '@app/shared/dtos/message/send-message.dto';
import { ClientProxy, Client, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
@WebSocketGateway(8080, { cors: { origin: '*' } })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  protected server: Server;

  @Client({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3002,
    },
  })
  private messageServiceClient: ClientProxy;

  async handleConnection(client: WebSocket) {
    console.log('Client connected:', client.readyState);
  }

  async handleDisconnect(client: WebSocket) {
    console.log('Client disconnected:', client);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() data: SendMessageDto,
  ): Promise<WsResponse<any>> {
    console.log('Triggered sendMessage event:', data);

    const dtoInstance = plainToInstance(SendMessageDto, data);
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      throw new WsException('Invalid message data');
    }

    const result = await firstValueFrom(
      this.messageServiceClient.send('messages.sendMessage', {
        ...data,
      }),
    );
    console.log('result', result);

    await this.server.clients.forEach((ws) => {
      ws.send(JSON.stringify({ event: 'sendMessage', data: result }));
    });
    return { event: 'sendMessage', data: result };
  }

  @SubscribeMessage('getMessages')
  async getMessages(
    @ConnectedSocket() client: WebSocket & { user?: any },
    @MessageBody() receiverId: number,
  ) {
    const userId = client.user?.id;
    console.log('getMessages', userId, receiverId);
    const result = await this.messageServiceClient
      .send('getMessages', {
        userId,
        receiverId,
      })
      .toPromise();

    this.server.clients.forEach((ws) => {
      ws.send(JSON.stringify({ event: 'getMessages', data: result }));
    });
    return result;
  }
}
