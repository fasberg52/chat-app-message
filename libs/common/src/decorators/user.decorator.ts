import { UserEntity } from '@app/database';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    console.log('Request User:', request.user);
    const user = request.user;
    return {
      id: user.sub,
      email: user.email,
      role: user.role,
    } as UserEntity;
  },
);
