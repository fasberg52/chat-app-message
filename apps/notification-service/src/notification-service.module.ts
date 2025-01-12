import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { datasource } from '@app/database';
import { ConfigModule } from '@nestjs/config';
import { NotificationItemService } from './services/notification-item.service';
import { NotificationService } from './services/notification.service';
import { NotificationItemController } from './controllers/notification-item.controller';
import { NotificationController } from './controllers/notification.controller';
import { NotificationRepository } from './repositorires/notification.repository';
import { NotificationItemRepository } from './repositorires/notification-item.repository';

const repository = [NotificationRepository, NotificationItemRepository];
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...datasource.options,
        autoLoadEntities: true,
      }),
    }),

    TypeOrmModule.forFeature([...repository]),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [NotificationItemController, NotificationController],
  providers: [NotificationItemService, NotificationService, ...repository],
})
export class NotificationServiceModule {}
