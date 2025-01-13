import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.respository';
import { UserEntity } from '@app/database';
import { NotFoundRpcException } from '@app/common/filters/rpc.exception';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: Partial<UserEntity>) {
    const user = await this.userRepository.createUser(dto);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundRpcException('نام کاربری یا رمز عبور اشتباه است');
    }
    return user;
  }

  async existByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    return !!user;
  }

  async getUsers() {
    const users = await this.userRepository.find();
    return users;
  }
}
