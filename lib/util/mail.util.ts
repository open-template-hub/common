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

  constructor(
    private args: EnvArgs,
    private debugLogUtil = new DebugLogUtil(),
    private builder = new BuilderUtil()
  ) {
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
      this.args.verifyAccountMailTemplatePath || ''
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
      this.args.resetPasswordMailTemplatePath || ''
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

    console.log('> MailUtil::send => Create Transport: ', url);
    let transporter = nodemailer.createTransport(this.config);

    let params = new Map<string, string>();
    params.set('${url}', url);
    params.set('${username}', user.username);

    let mailBody = this.builder.buildTemplateFromFile(template, params);

    console.log('> MailUtil::send => Sending Email: ', user.username);

    await transporter.sendMail({
      from: this.args.mailUsername,
      to: user.email,
      subject: subject,
      html: mailBody,
    });
  };
}
