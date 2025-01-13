import { Public } from '@app/common/decorators/public.decorator';
import { LoginDto, SignupDto } from '@app/shared/dtos/auth';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { TokenResponse } from '../../responses/user/token.response';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  @Client({
    transport: Transport.TCP,
    options: {
      host: process.env.USER_SERVICE_HOST,
      port: Number(process.env.USER_SERVICE_PORT),
    },
  })
  private userServiceClient: ClientProxy;

  @ApiOkResponse(TokenResponse.getApiDoc())
  @Public()
  @Post('login')
  async login(@Body() data: LoginDto): Promise<TokenResponse> {
    try {
      const result = await firstValueFrom(
        this.userServiceClient.send('auth.login', data),
      );
      return new TokenResponse(result.accessToken);
    } catch (error) {
      const { message, statusCode } = error;
      throw new HttpException(
        message,
        statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOkResponse(TokenResponse.getApiDoc())
  @Public()
  @Post('signup')
  async signup(@Body() data: SignupDto): Promise<TokenResponse> {
    try {
      const result = await firstValueFrom(
        this.userServiceClient.send('auth.signup', data),
      );
      return new TokenResponse(result.accessToken);
    } catch (error) {
      const { message, statusCode } = error;
      throw new HttpException(
        message,
        statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
