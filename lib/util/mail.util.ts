/**
 * @description holds mail util
 */

import nodemailer from 'nodemailer';

export class MailUtil {
  private readonly host: string;
  private readonly port: number;
  private readonly user: string;
  private readonly pass: string;

  constructor(
    user: string,
    pass: string,
    host: string,
    port?: number
  ) {
    this.user = user;
    this.pass = pass;
    this.host = host
    this.port = port ? port : 465 // Default
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
      from: this.user,
      to,
      subject: subject,
      html: body,
    });
  };
}
