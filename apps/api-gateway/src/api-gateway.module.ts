import { Module } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroserviceNameEnum } from './enum/microservice-name.enum';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessageGateway } from './gateway-message/message.gateway';
import { JwtGuard } from './controllers/auth/guards/jwt.guard';
import { RoleGuard } from './controllers/auth/guards/role.guard';
import { NotficationController } from './controllers/notifications/notificaiton.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { FileController } from './controllers/file/file.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.register([
      {
        name: MicroserviceNameEnum.USER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: process.env.USER_SERVICE_HOST,
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: MicroserviceNameEnum.MESSAGE_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: process.env.MESSAGE_SERVICE_HOST,
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: MicroserviceNameEnum.NOTIFICATION_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: process.env.NOTIFICATION_SERVICE_HOST,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AuthController, NotficationController, FileController],
  providers: [
    MessageGateway,
    JwtService,
    ApiGatewayService,

    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },

    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class ApiGatewayModule {}
