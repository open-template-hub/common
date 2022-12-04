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

    let targetTeam: any | undefined = undefined;

    for(let team of context.teams) {
      if((team as any)._id === _req.body.teamId) {
        targetTeam = team
      }
    }

    if(targetTeam === undefined) {
      throw new Error(ErrorMessage.FORBIDDEN);
    }

    let userRole: string | undefined = undefined;
    if(targetTeam.creator === context.username) {
      userRole = TeamRole.CREATOR;
    }
    else {
      const reader = context.teams?.find((team: any) => {
        return team.username === context.username;
      });

      const writer = context.teams?.find((team: any) => {
        return team.username === context.username
      })

      if(reader) {
        userRole = TeamRole.READER
      }
      else if(writer) {
        userRole = TeamRole.WRITER
      }
      else {
        userRole = undefined
      }
    }

    if(userRole === undefined) {
      throw new Error(ErrorMessage.FORBIDDEN);
    }

    next();
  };
};
