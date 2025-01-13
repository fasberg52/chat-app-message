import { Injectable } from '@nestjs/common';
import { NotificationItemService } from './notification-item.service';
import {
  CreateNotificationDto,
  CreateNotificationPrivateAdminDto,
} from '@app/shared/dtos/notification/create-notification.dto';
import { NotificationRepository } from '../repositorires/notification.repository';
import { UpdateNotificationDto } from '@app/shared/dtos/notification/update-notification.dto';
import { NotFoundRpcException } from '@app/common/filters/rpc.exception';
import { GetNotificationsDto } from '@app/shared/dtos/notification/get-all-notification.dto';
import { EntityManager, FindManyOptions, FindOptionsWhere } from 'typeorm';
import { NotificationEntity, NotificationItemEntity } from '@app/database';
import { NotificationTypeEnum } from '@app/database/enums/notificatoin.enum';
import { applySortingToFindOptions } from '@app/shared/factory/sort.factory';
import { UserService } from 'apps/user-service/src/users/users.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationItemService: NotificationItemService,
    private readonly userService: UserService,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async createNotificationPublicAdmin(dto: CreateNotificationDto) {
    const notification = await this.notificationRepository.create({
      title: dto.title,
      description: dto.description,
      type: NotificationTypeEnum.PUBLIC,
    });

    await this.notificationRepository.save(notification);

    const users = await this.userService.getUsers();

    for (const user of users) {
      await this.notificationItemService.createNotificationItem({
        userId: user.id,
        notificationId: notification.id,
        isRead: false,
      });
    }
    return notification;
  }

  async createNotificationPrivateAdmin(dto: CreateNotificationPrivateAdminDto) {
    return this.notificationRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        const notification = transactionalEntityManager.create(
          NotificationEntity,
          {
            title: dto.title,
            description: dto.description,
            type: NotificationTypeEnum.PRIVATE,
          },
        );

        const savedNotification = await transactionalEntityManager.save(
          NotificationEntity,
          notification,
        );

        const notificationItem = transactionalEntityManager.create(
          NotificationItemEntity,
          {
            userId: dto.userId,
            notificationId: savedNotification.id,
            isRead: false,
          },
        );

        await transactionalEntityManager.save(
          NotificationItemEntity,
          notificationItem,
        );

        return savedNotification;
      },
    );
  }

  async updateNotification(id: number, dto: UpdateNotificationDto) {
    const { title, description, type } = dto;

    const existingNotification =
      await this.notificationRepository.findNotificationById(id);
    if (!existingNotification) {
      throw new NotFoundRpcException('اعلان پیدا نشد');
    }

    const notification = await this.notificationRepository.update(id, {
      title,
      description,
      type,
    });
    return notification;
  }

  async getNotificationById(id: number) {
    const notification =
      await this.notificationRepository.findNotificationById(id);
    if (!notification) {
      throw new NotFoundRpcException('اعلان پیدا نشد');
    }
    return notification;
  }

  async deleteNotification(id: number) {
    const notification = await this.notificationRepository.softDelete(id);
    return notification;
  }

  async getNotifications(
    dto: GetNotificationsDto,
  ): Promise<[NotificationEntity[], number]> {
    const { page, limit, type, search, isRead, sort, sortBy } = dto;
    const where: FindOptionsWhere<NotificationEntity> = {};
    if (type) {
      where.type = type as NotificationTypeEnum;
    }
    if (search) {
      where.title = search;
    }

    if (isRead) {
      where.notificationItems = { isRead };
    }

    let options: FindManyOptions<NotificationEntity> = {
      where: {
        ...where,
      },
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        createdAt: true,
        notificationItems: {
          isRead: true,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    };
    options = applySortingToFindOptions(options, sort, sortBy, 'id', 'DESC');

    const [notifications, count] =
      await this.notificationRepository.findAndCount(options);
    return [notifications, count];
  }
}
