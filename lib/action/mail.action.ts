export type MailActionType = {
  contactUs: {
    params: ContactUsMailActionParams;
  };
  forgetPassword: {
    params: ForgetPasswordMailActionParams;
  };
  verifyAccount: {
    params: AccountVerificationMailActionParams;
  };
};

export interface ContactUsMailActionParams {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  website?: string;
  companySize?: string;
  country?: string;
  message: string;
}

export interface ForgetPasswordMailActionParams {
  user: string;
  email: string;
  passwordResetToken: string;
  clientResetPasswordUrl: string;
}

export interface AccountVerificationMailActionParams {
  user: string;
  email: string;
  accountVerificationToken: string;
  clientVerificationSuccessUrl: string;
}