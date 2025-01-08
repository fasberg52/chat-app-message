import { UserRoleEunm } from '@app/database/enums/role.enum';

declare global {
  namespace Express {
    interface Request {
      user?: {
        roles: UserRoleEunm[];
        id: number;
      };
    }
  }
}

export {};
