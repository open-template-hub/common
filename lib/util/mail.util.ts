/**
 * @description holds mail util
 */

import nodemailer from 'nodemailer';
import { EnvArgs } from '../interface/environment-args.interface';
import { User } from '../interface/user.interface';
import { BuilderUtil } from './builder.util';
import { DebugLogUtil } from './debug-log.util';

export class MailUtil {
  private readonly host: string;
  private readonly port: number;
  private readonly user: string;
  private readonly pass: string;

  constructor(
    private args: EnvArgs,
    private debugLogUtil = new DebugLogUtil(),
    private builder = new BuilderUtil()
  ) {
    this.host = this.args.mailArgs?.mailHost
      ? this.args.mailArgs?.mailHost
      : '';
    this.port = this.args.mailArgs?.mailPort
      ? parseInt(this.args.mailArgs?.mailPort)
      : 465; // Default;
    this.user = this.args.mailArgs?.mailUsername
      ? this.args.mailArgs?.mailUsername
      : '';
    this.pass = this.args.mailArgs?.mailPassword
      ? this.args.mailArgs?.mailPassword
      : '';
  }

  /**
   * sends account verification mail
   * @param user user
   * @param token token
   */
  sendAccountVerificationMail = async (user: User, token: string) => {
    const clientUrl = this.args.extentedArgs?.clientUrl || '';
    const clientVerificationSuccessUrl =
      this.args.extentedArgs?.clientVerificationSuccessUrl || '';

    let url = clientUrl + clientVerificationSuccessUrl + '?token=' + token;

    await this.send(
      url,
      user,
      'Account verification',
      this.args.mailArgs?.verifyAccountMailTemplatePath || ''
    );
  };

  /**
   * sends password reset mail
   * @param user user
   * @param token token
   */
  sendPasswordResetMail = async (user: User, token: string) => {
    const clientUrl = this.args.extentedArgs?.clientUrl || '';
    const clientResetPasswordUrl =
      this.args.extentedArgs?.clientResetPasswordUrl || '';

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
      this.args.mailArgs?.resetPasswordMailTemplatePath || ''
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
    if (this.args.mailArgs?.mailServerDisabled) {
      this.debugLogUtil.log(
        'Mail server is disabled. Some functionalities may not work properly.'
      );
      return;
    }

    console.log('> MailUtil::send => Create Transport: ', url);
    let transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: true,
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });

    let params = new Map<string, string>();
    params.set('${url}', url);
    params.set('${url2}', url);
    params.set('${username}', user.username);

    let mailBody = this.builder.buildTemplateFromFile(template, params);

    console.log('> MailUtil::send => Sending Email: ', user.username);

    await transporter.sendMail({
      from: this.args.mailArgs?.mailUsername,
      to: user.email,
      subject: subject,
      html: mailBody,
    });
  };
}
