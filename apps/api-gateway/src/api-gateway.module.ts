import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { MicroserviceNameEnum } from './enum/microservice-name.enum';
import { AuthController } from './auth/auth.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [ApiGatewayController, AuthController],
  providers: [
    ConfigService,
    ApiGatewayService,
    {
      provide: 'USER_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('USER_SERVICE_HOST'),
            port: configService.get('USER_SERVICE_PORT'),
          },
        });
      },
    },
  ],
})
export class ApiGatewayModule {}
