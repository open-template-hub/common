import { NextFunction, Request, Response } from 'express';
import { ErrorMessage } from './constant';
import { TeamRole } from './enum/team-role.enum';
import { UserRole } from './enum/user-role.enum';
import { Context } from './interface/context.interface';

export const authorizedBy = ( roles: Array<UserRole> ) => {
  return function ( _req: Request, res: Response, next: NextFunction ) {
    const context = res.locals.ctx as Context;
    if ( !roles.includes( context.role ) ) {
      throw new Error( ErrorMessage.FORBIDDEN );
    }
    next();
  };
};

export const teamAuthorizedBy = ( roles: Array<TeamRole> ) => {
  return function ( _req: Request, res: Response, next: NextFunction ) {
    const context = res.locals.ctx as Context;

    let targetTeam: any | undefined = undefined;

    for ( let team of context.teams ) {
      if ( ( team as any ).team_id === ( _req.body.teamId ?? _req.query.teamId ) ) {
        targetTeam = team;
      }
    }

    if ( targetTeam === undefined ) {
      throw new Error( ErrorMessage.FORBIDDEN );
    }

    let userRole: string | undefined = undefined;
    if ( targetTeam.creator === context.username ) {
      userRole = TeamRole.CREATOR;
    } else {
      const reader = targetTeam.readers.find( ( team: any ) => {
        return team.username === context.username && team.isVerified;
      } );

      const writer = targetTeam.writers.find( ( team: any ) => {
        return team.username === context.username && team.isVerified;
      } );

      if ( reader ) {
        userRole = TeamRole.READER;
      } else if ( writer ) {
        userRole = TeamRole.WRITER;
      } else {
        userRole = undefined;
      }
    }

    if ( userRole === undefined ) {
      throw new Error( 'Team:' + ErrorMessage.FORBIDDEN );
    }

    if ( !roles.includes( userRole as TeamRole ) ) {
      throw new Error( 'Team:' + ErrorMessage.FORBIDDEN );
    }

    next();
  };


};
