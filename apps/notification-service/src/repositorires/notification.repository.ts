import { NotificationEntity } from '@app/database';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NotificationRepository extends Repository<NotificationEntity> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly confgService: ConfigService,
  ) {
    super(NotificationEntity, dataSource.createEntityManager());
  }

  async findNotificationById(id: number) {
    return this.findOne({ where: { id: id } });
  }

  async findAll(dto: Partial<NotificationEntity>) {
    return this.find({ where: dto });
  }
}
