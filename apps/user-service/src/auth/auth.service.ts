import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../users/users.service';
import { LoginDto, SignupDto } from '@app/shared/dtos/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateToken(user: any) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.signAsync(payload);
  }

  async singup(dto: SignupDto) {
    const exitingUser = await this.userService.findByEmail(dto.email);
    if (exitingUser) {
      throw new ConflictException('این ایمیل وجود از قبل وجود دارد');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    const user = await this.userService.createUser({
      ...dto,
      password: hashedPassword,
    });

    const accessToken = await this.generateToken(user);
    return { user, accessToken };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('کاربری با این ایمیل یافت نشد');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('ایمیل یا پسورد اشتباه است');
    }
    const accessToken = await this.generateToken(user);
    return { user, accessToken };
  }
}
