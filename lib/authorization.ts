import { ErrorMessage } from './constant';
import { UserRole } from './enum/user-role.enum';
import { Context } from './interface/context.interface';
import { NextFunction, Request, Response } from 'express';
import { TeamRole } from './enum/team-role.enum';
import { Team } from './interface/team.interface';

export const authorizedBy = (roles: Array<UserRole>) => {
  return function (_req: Request, res: Response, next: NextFunction) {
    const context = res.locals.ctx as Context;
    if (!roles.includes(context.role)) {
      throw new Error(ErrorMessage.FORBIDDEN);
    }
    next();
  };
};

export const teamAuthorizedBy = (roles: Array<TeamRole>) => {
  return function (_req: Request, res: Response, next: NextFunction) {
    const context = res.locals.ctx as Context;

    const team = context.teams?.find((team) => {
      return team.id === _req.body.teamId;
    });

    if (!team && !roles.includes(team!.role)) {
      throw new Error(ErrorMessage.FORBIDDEN);
    }

    next();
  };
};
