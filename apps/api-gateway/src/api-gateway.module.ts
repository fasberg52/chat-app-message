import { Module } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { MicroserviceNameEnum } from './enum/microservice-name.enum';
import { AuthController } from './auth/auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from 'apps/api-gateway/src/auth/guards/jwt.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  controllers: [AuthController],
  providers: [
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
