/**
 * @description holds Token Args interface
 */

export interface TokenArgs {
  accessTokenSecret?: string;
  accessTokenExpire?: string;
  refreshTokenSecret?: string;
  refreshTokenExpire?: string;
  verificationTokenSecret?: string;
  resetPasswordTokenSecret?: string;
  resetPasswordTokenExpire?: string;
}
