/**
 * @description holds mail util
 */

import nodemailer from 'nodemailer';
import { EnvArgs } from '../interface/environment-args.interface';

export class MailUtil {
  private readonly host: string;
  private readonly port: number;
  private readonly user: string;
  private readonly pass: string;

  constructor(private args: EnvArgs) {
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
   * sends mail
   * @param to to
   * @param subject mail subject
   * @param body mail body
   */
  send = async (to: string, subject: string, body: string) => {
    let transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: true,
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });

    console.log('> MailUtil::send => Sending Email: ', to);

    await transporter.sendMail({
      from: this.args.mailArgs?.mailUsername,
      to,
      subject: subject,
      html: body,
    });
  };
}
