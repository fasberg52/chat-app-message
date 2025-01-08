import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroserviceNameEnum } from './enum/microservice-name.enum';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MicroserviceNameEnum.USER_SERVICE,
        transport: Transport.TCP,
        options: { host: 'user-service', port: 3001 },
      },
      {
        name: MicroserviceNameEnum.MESSAGE_SERVICE,
        transport: Transport.TCP,
        options: { host: 'user-service', port: 3002 },
      },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
