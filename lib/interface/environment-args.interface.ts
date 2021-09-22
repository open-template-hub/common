/**
 * @description holds Environment Args interface
 */

export interface EnvArgs {
  tokenArgs?: TokenArgs;
  dbArgs?: DbArgs;
  mailArgs?: MailArgs;
  extentedArgs?: ExtendedArgs;
  mqArgs?: MqArgs;
  serverSpecificArgs?: any;
}

export interface TokenArgs {
  accessTokenSecret?: string;
  accessTokenExpire?: string;
  refreshTokenSecret?: string;
  refreshTokenExpire?: string;
  verificationTokenSecret?: string;
  resetPasswordTokenSecret?: string;
  resetPasswordTokenExpire?: string;
  responseEncryptionSecret?: string;
}

export interface DbArgs {
  mongoDbUri?: string;
  mongoDbConnectionLimit?: string;
  postgreSqlUri?: string;
  postgreSqlConnectionLimit?: string;
}

export interface MailArgs {
  mailHost?: string;
  mailPort?: string;
  mailUsername?: string;
  mailPassword?: string;
}

export interface MqArgs {
  messageQueueConnectionUrl?: string;
  orchestrationServerMessageQueueChannel?: string;
  authServerMessageQueueChannel?: string;
  paymentServerMessageQueueChannel?: string;
  fileServerMessageQueueChannel?: string;
  basicInfoServerMessageQueueChannel?: string;
  analyticsServerMessageQueueChannel?: string;
  mailServerMessageQueueChannel?: string;
}

export interface ExtendedArgs {
  regression?: boolean;
  clientUrl?: string;
  clientResetPasswordUrl?: string;
  clientVerificationSuccessUrl?: string;
}
