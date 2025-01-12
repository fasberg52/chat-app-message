import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  NotificationResponse,
  NotificationsListResponse,
} from '../../responses/notification/notification.response';
import { CreateNotificationDto, GetNotificationsDto } from '@app/shared';
import { firstValueFrom } from 'rxjs';
import { Roles } from '@app/common/decorators/role.decorator';
import { UserRoleEunm } from '@app/database';
import { MessageResponse } from '@app/common/responses/base.response';
import { UpdateNotificationDto } from '@app/shared/dtos/notification/update-notification.dto';

@Controller('notifications')
@ApiTags('Admin - Notifications')
@ApiBearerAuth()
export class NotficationController {
  @Client({
    transport: Transport.TCP,
    options: {
      host: process.env.NOTIFICATION_SERVICE_HOST,
      port: Number(process.env.NOTIFICATION_SERVICE_PORT),
    },
  })
  private notificationServiceClient: ClientProxy;

  @ApiOkResponse(NotificationsListResponse.getApiDoc())
  @Roles(UserRoleEunm.ADMIN)
  @Get()
  async getNotifications(
    @Query() data: GetNotificationsDto,
  ): Promise<NotificationsListResponse> {
    try {
      const result = await firstValueFrom(
        this.notificationServiceClient.send('notification.get', data),
      );
      return new NotificationsListResponse(result.result, result.total);
    } catch (error) {
      const { message, statusCode } = error;
      throw new HttpException(
        message,
        statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOkResponse(NotificationResponse.getApiDoc())
  @Roles(UserRoleEunm.ADMIN)
  @Get(':id')
  async getNotification(
    @Param('id') id: string,
  ): Promise<NotificationResponse> {
    try {
      const result = await firstValueFrom(
        this.notificationServiceClient.send('notification.get', id),
      );
      return new NotificationResponse(result.result);
    } catch (error) {
      const { message, statusCode } = error;
      throw new HttpException(
        message,
        statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOkResponse(MessageResponse.getApiDoc())
  @Roles(UserRoleEunm.ADMIN)
  @Post()
  async createNotification(
    @Body() data: CreateNotificationDto,
  ): Promise<MessageResponse> {
    try {
      await firstValueFrom(
        this.notificationServiceClient.send('notification.create', data),
      );
      return new MessageResponse('با موفقیت ایجاد شد ');
    } catch (error) {
      const { message, statusCode } = error;
      throw new HttpException(
        message,
        statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOkResponse(MessageResponse.getApiDoc())
  @Roles(UserRoleEunm.ADMIN)
  @Delete(':id')
  async deleteNotification(@Param('id') id: string): Promise<MessageResponse> {
    try {
      await firstValueFrom(
        this.notificationServiceClient.send('notification.delete', id),
      );
      return new MessageResponse('با موفقیت حذف شد ');
    } catch (error) {
      const { message, statusCode } = error;
      throw new HttpException(
        message,
        statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOkResponse(MessageResponse.getApiDoc())
  @Roles(UserRoleEunm.ADMIN)
  @Put(':id')
  async updateNotification(
    @Param('id') id: string,
    @Body() data: UpdateNotificationDto,
  ): Promise<MessageResponse> {
    try {
      await firstValueFrom(
        this.notificationServiceClient.send('notification.update', {
          id,
          data,
        }),
      );
      return new MessageResponse('با موفقیت بروزرسانی شد ');
    } catch (error) {
      const { message, statusCode } = error;
      throw new HttpException(
        message,
        statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
