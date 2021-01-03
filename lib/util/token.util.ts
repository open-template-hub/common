/**
 * @description holds token util
 */

import jwt from 'jsonwebtoken';
import { ResponseCode, TokenDefaults } from '../constant';
import { EnvArgs } from '../interface/environment.interface';
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
      },
      this.args.accessTokenSecret || '',
      {
        expiresIn: this.args.accessTokenExpire || TokenDefaults.expire.accessToken,
      }
    );
  };

  /**
   * generates refresh token
   * @param user user
   */
  generateRefreshToken = (user: User) => {
    const token = jwt.sign(
      {
        username: user.username,
        role: user.role,
      },
      this.args.refreshTokenSecret || '',
      {
        expiresIn: this.args.refreshTokenExpire || TokenDefaults.expire.refreshToken,
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
      this.args.verificationTokenSecret || ''
    );
  };

  /**
   * generates password reset token
   * @param user user
   */
  generatePasswordResetToken = (user: User) => {
    return jwt.sign(
      { username: user.username },
      this.args.resetPasswordTokenSecret + user.password,
      {
        expiresIn:
          this.args.resetPasswordTokenExpire ||
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
      return jwt.verify(token, this.args.accessTokenSecret || '');
    } catch (e) {
      console.error(e);
      if (e.name === 'JsonWebTokenError') {
        e.responseCode = ResponseCode.FORBIDDEN;
      } else if (e.name === 'TokenExpiredError') {
        e.responseCode = ResponseCode.UNAUTHORIZED;
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
      return jwt.verify(token, this.args.refreshTokenSecret || '');
    } catch (e) {
      console.error(e);
      if (e.name === 'JsonWebTokenError') {
        e.responseCode = ResponseCode.FORBIDDEN;
      } else if (e.name === 'TokenExpiredError') {
        e.responseCode = ResponseCode.UNAUTHORIZED;
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
      return jwt.verify(token, this.args.verificationTokenSecret || '');
    } catch (e) {
      console.error(e);
      if (e.name === 'JsonWebTokenError') {
        e.responseCode = ResponseCode.FORBIDDEN;
      } else if (e.name === 'TokenExpiredError') {
        e.responseCode = ResponseCode.UNAUTHORIZED;
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
      return jwt.verify(token, this.args.resetPasswordTokenSecret + currentPassword);
    } catch (e) {
      console.error(e);
      if (e.name === 'JsonWebTokenError') {
        e.responseCode = ResponseCode.FORBIDDEN;
      } else if (e.name === 'TokenExpiredError') {
        e.responseCode = ResponseCode.UNAUTHORIZED;
      }
      throw e;
    }
  };
}
