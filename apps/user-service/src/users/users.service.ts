import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.respository';
import { UserEntity } from '@app/database';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: Partial<UserEntity>) {
    const user = await this.userRepository.createUser(dto);
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}
