import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../users/users.service';
import { LoginDto, SignupDto } from '@app/shared/dtos/auth';
import {
  BadRequestRpcException,
  NotFoundRpcException,
} from '@app/common/filters/rpc.exception';
import { UserRoleEunm } from '@app/database';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  async singup(dto: SignupDto) {
    const exitingUser = await this.userService.existByEmail(dto.email);
    if (exitingUser) {
      throw new BadRequestRpcException('این ایمیل وجود از قبل وجود دارد');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    console.log(`data is ${dto}`);
    const user = await this.userService.createUser({
      ...dto,
      password: hashedPassword,
      role: UserRoleEunm.USER,
    });
    console.log(`user is ${user}`);

    const accessToken = await this.generateToken(user);
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
    return { user: userResponse, accessToken };
  }

  async login(dto: LoginDto) {
    console.log(dto);
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundRpcException('نام کاربری یا رمز عبور اشتباه است');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestRpcException('ایمیل یا پسورد اشتباه است');
    }
    const accessToken = await this.generateToken(user);
    return { user, accessToken };
  }
}
