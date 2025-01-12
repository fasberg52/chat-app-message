import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { UserEntity } from './entities/user.entity';
import { MessageEntity } from './entities/message.entity';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationItemEntity } from './entities/notification-item.entity';
import { FileEntity } from './entities/file.entity';

dotenvConfig({ path: '.env' });

export const datasource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  database: process.env.DATABASE_NAME,
  password: `${process.env.DATABASE_PASSWORD}`,
  entities: [
    UserEntity,
    MessageEntity,
    NotificationEntity,
    NotificationItemEntity,
    FileEntity,
  ],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
