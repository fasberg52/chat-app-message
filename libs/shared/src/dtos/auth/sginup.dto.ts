import { UserEntity } from '@app/database';
import { PickType } from '@nestjs/swagger';

export class SignupDto extends PickType(UserEntity, [
  'email',
  'firstName',
  'lastName',
  'password',
] as const) {}
