/**
 * @description holds token util
 */

import jwt from 'jsonwebtoken';
import { ResponseCode, TokenDefaults } from '../constant';
import { EnvArgs } from '../interface/environment-args.interface';
import { Team } from '../interface/team.interface';
import { User } from '../interface/user.interface';

export class TokenUtil {
  constructor(private args: EnvArgs) {} 

  /**
   * generates access token
   * @param user user
   */
  generateAccessToken = (user: User) => {
    return jwt.sign(
      {
        username: user.username,
        role: user.role,
        teams: user.teams
      },
      this.args.tokenArgs?.accessTokenSecret || '',
      {
        expiresIn:
          this.args.tokenArgs?.accessTokenExpire ||
          TokenDefaults.expire.accessToken,
      }
    );
  };

  generatePreAuthToken = (user: User) => {
    return jwt.sign(
      {
        username: user.username
      },
      this.args.tokenArgs?.preAuthTokenSecret || '',
      {
        expiresIn: this.args.twoFactorCodeArgs.twoFactorCodeExpire + 'sec' ||
        TokenDefaults.expire.preAuthToken
      }
    );
  }

  /**
   * generates refresh token
   * @param user user
   */
  generateRefreshToken = (user: User) => {
    const token = jwt.sign(
      {
        username: user.username,
        role: user.role,
        teams: user.teams
      },
      this.args.tokenArgs?.refreshTokenSecret || '',
      {
        expiresIn:
          this.args.tokenArgs?.refreshTokenExpire ||
          TokenDefaults.expire.refreshToken,
      }
    );
    const { exp } = jwt.decode(token) as any;
    return { token: token, exp: exp };
  };

  /**
   * generates verification token
   * @param user user
   */
  generateVerificationToken = (user: User) => {
    return jwt.sign(
      { username: user.username },
      this.args.tokenArgs?.verificationTokenSecret || ''
    );
  };

  /**
   * generates password reset token
   * @param user user
   */
  generatePasswordResetToken = (user: User) => {
    return jwt.sign(
      { username: user.username },
      this.args.tokenArgs?.resetPasswordTokenSecret + user.password,
      {
        expiresIn:
          this.args.tokenArgs?.resetPasswordTokenExpire ||
          TokenDefaults.expire.resetPasswordToken,
      }
    );
  };

  /**
   * verifies access token
   * @param token token
   */
  verifyAccessToken = (token: string) => {
    try {
      return jwt.verify(token, this.args.tokenArgs?.accessTokenSecret || '');
    } catch (e) {
      const error = e as any;
      console.error(error);
      if (error.name === 'JsonWebTokenError') {
        error.responseCode = ResponseCode.FORBIDDEN;
      } else if (error.name === 'TokenExpiredError') {
        error.responseCode = ResponseCode.UNAUTHORIZED;
      }
      throw e;
    }
  };

  /**
   * verifies refresh token
   * @param token token
   */
  verifyRefreshToken = (token: string) => {
    try {
      return jwt.verify(token, this.args.tokenArgs?.refreshTokenSecret || '');
    } catch (e) {
      const error = e as any;
      console.error(error);
      if (error.name === 'JsonWebTokenError') {
        error.responseCode = ResponseCode.FORBIDDEN;
      } else if (error.name === 'TokenExpiredError') {
        error.responseCode = ResponseCode.UNAUTHORIZED;
        error.message = 'refresh token expired';
      }
      throw e;
    }
  };

  /**
   * verifies verification token
   * @param token token
   */
  verifyVerificationToken = (token: string) => {
    try {
      return jwt.verify(
        token,
        this.args.tokenArgs?.verificationTokenSecret || ''
      );
    } catch (e) {
      const error = e as any;
      console.error(error);
      if (error.name === 'JsonWebTokenError') {
        error.responseCode = ResponseCode.FORBIDDEN;
      } else if (error.name === 'TokenExpiredError') {
        error.responseCode = ResponseCode.UNAUTHORIZED;
      }
      throw e;
    }
  };

  /**
   * verifies password reset token
   * @param token token
   * @param currentPassword current password
   */
  verifyPasswordResetToken = (token: string, currentPassword: string) => {
    try {
      return jwt.verify(
        token,
        this.args.tokenArgs?.resetPasswordTokenSecret + currentPassword
      );
    } catch (e) {
      const error = e as any;
      console.error(error);
      if (error.name === 'JsonWebTokenError') {
        error.responseCode = ResponseCode.FORBIDDEN;
      } else if (error.name === 'TokenExpiredError') {
        error.responseCode = ResponseCode.UNAUTHORIZED;
      }
      throw e;
    }
  };

  verifyPreAuthToken = ( token: string ) => {
    try {
      return jwt.verify(
        token,
        this.args.tokenArgs?.preAuthTokenSecret ?? ''
      )
    } catch (e) {
      const error = e as any;
      console.error(error);
      if (error.name === 'JsonWebTokenError') {
        error.responseCode = ResponseCode.FORBIDDEN;
      } else if (error.name === 'TokenExpiredError') {
        error.responseCode = ResponseCode.UNAUTHORIZED;
      }
      throw e;
    } 
  }

  generateJoinTeamToken = (username: string, team: Team) => {
    return jwt.sign(
      { username: username, team: team },
      this.args.tokenArgs?.joinTeamTokenSecret as string,
      {
        expiresIn:
          this.args.tokenArgs?.joinTeamTokenSecretExpire ||
          TokenDefaults.expire.teamToken
      }
    );
  }

  verifyTeamToken = (token: string) => {
    try {
      return jwt.verify(
        token,
        this.args.tokenArgs?.preAuthTokenSecret ?? ''
      );
    } catch(e) {
      const error = e as any;
      console.error(error);
      if (error.name === 'JsonWebTokenError') {
        error.responseCode = ResponseCode.FORBIDDEN;
      } else if (error.name === 'TokenExpiredError') {
        error.responseCode = ResponseCode.UNAUTHORIZED;
      }
      throw e; 
    }
  }

  addTeamToToken(currentToken: string, team: any ) {
    try {
      const token = jwt.decode(currentToken) as any;

      let tokenTeamArray = []
      if(token.teams) {
        tokenTeamArray = token.teams; 
      }
      tokenTeamArray.push(team)

      const accessTokenWithTeam = jwt.sign(
        {
          username: token.username,
          role: token.role,
          teams: tokenTeamArray
        },
        this.args.tokenArgs?.accessTokenSecret || '',
        {
          expiresIn: token.exp
        }
      )

      const refreshTokenWithTeam = jwt.sign(
        {
          username: token.username,
          role: token.role,
          teams: tokenTeamArray
        },
        this.args.tokenArgs?.refreshTokenSecret || '',
        {
          expiresIn:
            this.args.tokenArgs?.refreshTokenExpire ||
            TokenDefaults.expire.refreshToken,
        }
      )

      return { accessTokenWithTeam,refreshTokenWithTeam }


    } catch(e) {
      const error = e as any;
      console.error(error);
      if (error.name === 'JsonWebTokenError') {
        error.responseCode = ResponseCode.FORBIDDEN;
      } else if (error.name === 'TokenExpiredError') {
        error.responseCode = ResponseCode.UNAUTHORIZED;
      }
      throw e;
    }
  }
}
