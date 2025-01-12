import { NotificationItemEntity } from '@app/database';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NotificationItemRepository extends Repository<NotificationItemEntity> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly confgService: ConfigService,
  ) {
    super(NotificationItemEntity, dataSource.createEntityManager());
  }
}
