import { ErrorMessage } from './constant';
import { UserRole } from './enum/user-role.enum';
import { Context } from './interface/context.interface';

export const authorizedBy = (roles: Array<UserRole>) => {
  return function (req: any, res: any, next: any) {
    const context = res.locals.ctx as Context;
    if (!roles.includes(context.role)) {
      throw new Error(ErrorMessage.FORBIDDEN);
    }
    next();
  };
};
