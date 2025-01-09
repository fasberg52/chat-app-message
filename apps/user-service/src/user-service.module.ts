import { Module } from '@nestjs/common';
import { AuthController, AuthService } from './auth';
import { UserService } from './users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './users/users.respository';
import { datasource } from '@app/database/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { JwtService } from '@nestjs/jwt';
import { HttpExceptionFilter } from '@app/common';

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
  providers: [
    JwtService,
    AuthService,
    UserService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class UserServiceModule {}
