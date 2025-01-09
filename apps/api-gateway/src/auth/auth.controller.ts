import { Public } from '@app/common/decorators/public.decorator';
import { LoginDto } from '@app/shared/dtos/auth';
import { Body, Controller, Headers, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(@Inject('USER_SERVICE') private userServiceClient: ClientProxy) {}

  @ApiCreatedResponse()
  @Public()
  @Post('login')
  async login(@Body() data: LoginDto, @Headers() headers: any) {
    return firstValueFrom(
      this.userServiceClient.send('auth.login', { data, headers }),
    );
  }
}
