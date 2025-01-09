import { Module } from '@nestjs/common';
import { AuthController, AuthService } from './auth';
import { UserService } from './users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './users/users.respository';
import { datasource } from '@app/database/config';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

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

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    ConfigService,
    JwtService,
    AuthService,
    UserService,
    ...repository,
  ],
  exports: [UserService],
})
export class UserServiceModule {}
