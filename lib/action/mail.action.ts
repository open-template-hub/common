export type MailActionType = {
  contactUs: {
    params: ContactUsMailActionParams
  },
  forgetPassword: {
    params: ForgetPasswordMailActionParams
  }
};

export interface ContactUsMailActionParams {
  firstName: string,
  lastName: string,
  email: string,
  phone?: string,
  website?: string,
  companySize?: string,
  country?: string,
  message: string
}

export interface ForgetPasswordMailActionParams {
  user: string,
  passwordResetToken: string
}
