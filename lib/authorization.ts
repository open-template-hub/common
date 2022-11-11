import { ErrorMessage } from './constant';
import { UserRole } from './enum/user-role.enum';
import { Context } from './interface/context.interface';
import { NextFunction, Request, Response } from 'express';

export const authorizedBy = (roles: Array<UserRole>) => {
  return function (_req: Request, res: Response, next: NextFunction) {
    const context = res.locals.ctx as Context;
    if (!roles.includes(context.role)) {
      throw new Error(ErrorMessage.FORBIDDEN);
    }
    next();
  };
};
