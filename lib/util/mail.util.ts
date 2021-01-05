/**
 * @description holds mail util
 */

import nodemailer from 'nodemailer';
import { EnvArgs } from '../interface/environment.interface';
import { User } from '../interface/user.interface';
import { BuilderUtil } from './builder.util';
import { DebugLogUtil } from './debug-log.util';

export class MailUtil {
  private readonly config: any;
  private readonly templates: any;

  constructor(
    private args: EnvArgs,
    private debugLogUtil = new DebugLogUtil(),
    private builder = new BuilderUtil()
  ) {
    this.templates = {
      verifyAccount:
        './assets/mail-templates/verify-account-mail-template.html',
      forgetPassword:
        './assets/mail-templates/forget-password-mail-template.html',
    };
    this.config = {
      host: this.args.mailHost,
      port: this.args.mailPort,
      secure: this.args.mailPort === '465' ? true : false,
      auth: {
        user: this.args.mailUsername,
        pass: this.args.mailPassword,
      },
    };
  }

  /**
   * sends account verification mail
   * @param user user
   * @param token token
   */
  sendAccountVerificationMail = async (user: User, token: string) => {
    const clientUrl = this.args.clientUrl || '';
    const clientVerificationSuccessUrl =
      this.args.clientVerificationSuccessUrl || '';

    let url = clientUrl + clientVerificationSuccessUrl + '?token=' + token;

    await this.send(
      url,
      user,
      'Account verification',
      this.templates.verifyAccount
    );
  };

  /**
   * sends password reset mail
   * @param user user
   * @param token token
   */
  sendPasswordResetMail = async (user: User, token: string) => {
    const clientUrl = this.args.clientUrl || '';
    const clientResetPasswordUrl = this.args.clientResetPasswordUrl || '';

    let url =
      clientUrl +
      clientResetPasswordUrl +
      '?token=' +
      token +
      '&username=' +
      user.username;

    await this.send(
      url,
      user,
      'Forget password',
      this.templates.forgetPassword
    );
  };

  /**
   * sends mail
   * @param url url
   * @param user user
   * @param subject mail subject
   * @param template mail template
   */
  send = async (url: string, user: User, subject: string, template: string) => {
    if (this.args.mailServerDisabled) {
      this.debugLogUtil.log(
        'Mail server is disabled. Some functionalities may not work properly.'
      );
      return;
    }

    let transporter = nodemailer.createTransport(this.config);

    let params = new Map<string, string>();
    params.set('${url}', url);
    params.set('${username}', user.username);

    let mailBody = this.builder.buildTemplateFromFile(template, params);

    await transporter.sendMail({
      from: this.args.mailUsername,
      to: user.email,
      subject: subject,
      html: mailBody,
    });
  };
}
