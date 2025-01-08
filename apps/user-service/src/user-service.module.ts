import { Module } from '@nestjs/common';
import { AuthController, AuthService } from './auth';
import { UserService } from './users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './users/users.respository';
import { datasource } from '@app/database/config';

const repository = [UserRepository];
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...datasource.options,
        autoLoadEntities: true,
      }),
    }),

    TypeOrmModule.forFeature([...repository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class UserServiceModule {}
