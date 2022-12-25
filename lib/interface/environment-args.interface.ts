/**
 * @description holds Environment Args interface
 */

export interface Environment {
  args(): EnvArgs;
}

export interface EnvArgs {
  tokenArgs?: TokenArgs;
  dbArgs?: DbArgs;
  extendedArgs?: ExtendedArgs;
  mqArgs?: MqArgs;
  serverSpecificArgs?: any;
  twoFactorCodeArgs: TwoFactorArgs;
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
  preAuthTokenSecret?: string;
  joinTeamTokenSecret?: string;
  joinTeamTokenSecretExpire?: string;
}

export interface DbArgs {
  mongoDbUri?: string;
  mongoDbConnectionLimit?: string;
  postgresqlUri?: string;
  postgresqlConnectionLimit?: string;
}

export interface MqArgs {
  messageQueueConnectionUrl?: string;
  orchestrationServerMessageQueueChannel?: string;
  authServerMessageQueueChannel?: string;
  paymentServerMessageQueueChannel?: string;
  fileServerMessageQueueChannel?: string;
  businessLogicServerMessageQueueChannel?: string;
  analyticsServerMessageQueueChannel?: string;
  mailServerMessageQueueChannel?: string;
  smsServerMessageQueueChannel?: string;
  cloudIntegrationServerMessageQueueChannel?: string;
}

export interface ExtendedArgs {
  regression?: boolean;
  clientUrl?: string;
  whiteListUrls?: string;
}

export interface TwoFactorArgs {
  twoFactorCodeExpire: string;
  twoFactorCodeLength: string;
  twoFactorCodeType: string;
}
