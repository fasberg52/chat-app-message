import { Controller } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  @Client({
    transport: Transport.TCP,
    options: { host: 'user-service', port: 3001 },
  })
  private userServiceClient: ClientProxy;
}
