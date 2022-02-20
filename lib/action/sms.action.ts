export type SmsActionType = {
  smsType: {
    twoFactorCodeRequest: {
      params: TwoFactorCodeRequestParams;
    }
  };
  language?: string;
};

export interface TwoFactorCodeRequestParams {
  username: string;
  phoneNumber: string;
  twoFactorCode: string;
}
