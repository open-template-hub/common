export type MailActionType = {
  contactUs: {
    params: {
      firstName: string,
      lastName: string,
      email: string,
      phone?: string,
      website?: string,
      companySize?: string,
      country?: string,
      message: string
    }
  },
  forgetPassword: {
    params: {
      user: string,
      passwordResetToken: string
    }
  }
};
