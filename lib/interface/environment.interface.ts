/**
 * @description holds Environment Args interface
 */

export interface EnvArgs {
  accessTokenSecret?: string;
  accessTokenExpire?: string;
  refreshTokenSecret?: string;
  refreshTokenExpire?: string;
  verificationTokenSecret?: string;
  resetPasswordTokenSecret?: string;
  resetPasswordTokenExpire?: string;
  responseEncryptionSecret?: string;
  mongoDbUri?: string;
  mongoDbConnectionLimit?: string;
  postgreSqlUri?: string;
  postgreSqlConnectionLimit?: string;
}
