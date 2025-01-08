import { datasource, UserEntity } from '@app/database';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor() {
    super(UserEntity, datasource.createEntityManager());
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({ where: { email } });
  }

  async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
    return this.save(user);
  }
}
