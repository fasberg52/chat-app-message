import { LoginDto } from '@app/shared/dtos/auth';
import { Body, Controller, Post } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  @Client({
    transport: Transport.TCP,
    options: { host: 'user-service', port: 3001 },
  })
  private userServiceClient: ClientProxy;

  @ApiOkResponse()
  @Post('login')
  async login(@Body() data: LoginDto) {
    return firstValueFrom(this.userServiceClient.send('auth.login', data));
  }
}
