import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto, SignupDto } from '@app/shared/dtos/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.login')
  async login(@Payload() data: LoginDto) {
    console.log(`login >>> ${data}`);
    return this.authService.login(data);
  }

  @MessagePattern('auth.signup')
  async signup(@Payload() data: SignupDto) {
    console.log(`signup >>> ${JSON.stringify(data)}`);

    return this.authService.singup(data);
  }
}
