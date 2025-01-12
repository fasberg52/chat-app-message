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
        transport: Transport.TCP,
        options: {
          host: new ConfigService().get<string>('USER_SERVICE_HOST'),
          port: new ConfigService().get<number>('USER_SERVICE_PORT'),
        },
      },
      {
        name: MicroserviceNameEnum.MESSAGE_SERVICE,
        transport: Transport.TCP,
        options: {
          host: new ConfigService().get<string>('MESSAGE_SERVICE_HOST'),
          port: new ConfigService().get<number>('MESSAGE_SERVICE_PORT'),
        },
      },
    ]),
  ],
  controllers: [AuthController, NotficationController],
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
