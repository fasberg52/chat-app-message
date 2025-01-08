import { UserEntity } from '@app/database';
import { PickType } from '@nestjs/swagger';

export class LoginDto extends PickType(UserEntity, [
  'email',
  'password',
] as const) {}
