import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.respository';
import { UserEntity } from '@app/database';
import { NotFoundRpcException } from '@app/common/filters/rpc.exception';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: Partial<UserEntity>) {
    console.log(`dto is ${JSON.stringify(dto)}`);
    const user = await this.userRepository.createUser(dto);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundRpcException('کاربری با این ایمیل یافت نشد');
    }
    return user;
  }

  async existByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    console.log(`user is ${user}`);
    return !!user;
  }
}
