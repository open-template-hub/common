/**
 * @description holds token util
 */

import jwt from 'jsonwebtoken';
import { ResponseCode, TokenDefaults } from '../constant';
import { User } from '../interface/user.interface';

export class TokenUtil {
  constructor(
    private accessTokenSecret?: string,
    private accessTokenExpire?: string,
    private refreshTokenSecret?: string,
    private refreshTokenExpire?: string,
    private verificationTokenSecret?: string,
    private resetPasswordTokenSecret?: string,
    private resetPasswordTokenExpire?: string
  ) {}
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
      this.accessTokenSecret || '',
      {
        expiresIn: this.accessTokenExpire || TokenDefaults.expire.accessToken,
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
      this.refreshTokenSecret || '',
      {
        expiresIn: this.refreshTokenExpire || TokenDefaults.expire.refreshToken,
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
      this.verificationTokenSecret || ''
    );
  };

  /**
   * generates password reset token
   * @param user user
   */
  generatePasswordResetToken = (user: User) => {
    return jwt.sign(
      { username: user.username },
      this.resetPasswordTokenSecret + user.password,
      {
        expiresIn:
          this.resetPasswordTokenExpire ||
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
      return jwt.verify(token, this.accessTokenSecret || '');
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
      return jwt.verify(token, this.refreshTokenSecret || '');
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
      return jwt.verify(token, this.verificationTokenSecret || '');
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
      return jwt.verify(token, this.resetPasswordTokenSecret + currentPassword);
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
