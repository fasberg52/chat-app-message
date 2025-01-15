import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from '@app/database/entities/message.entity';
import { MessageService } from './services/message.service';
import { datasource } from '@app/database/config';
import { MessageController } from './controllers/message.controller';
import { FileUploadService } from './services/file.service';
import { FileController } from './controllers/file.controller';
import { FileEntity } from '@app/database/entities/file.entity';
import { S3Service } from './services/s3.service';
import { UserEntity } from '@app/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...datasource.options,
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature([MessageEntity, FileEntity, UserEntity]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MessageService, FileUploadService, S3Service],
  controllers: [MessageController, FileController],
})
export class MessagingServiceModule {}
