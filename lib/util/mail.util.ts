/**
 * @description holds mail util
 */

import nodemailer from 'nodemailer';

export class MailUtil {
  private readonly host: string;
  private readonly port: number;
  private readonly user: string;
  private readonly pass: string;
  private readonly sslV3: boolean;

  constructor(
      user: string,
      pass: string,
      host: string,
      sslV3: boolean,
      port?: number
  ) {
    this.user = user;
    this.pass = pass;
    this.host = host;
    this.sslV3 = sslV3;
    this.port = port ? port : 465; // Default
  }

  /**
   * sends mail
   * @param to to
   * @param subject mail subject
   * @param body mail body
   */
  send = async ( to: string, subject: string, body: string ) => {
    const transportBody: any = {
      host: this.host,
      port: this.port,
      secure: true,
      auth: {
        user: this.user,
        pass: this.pass,
      },
    };

    if ( this.sslV3 ) {
      transportBody.secure = false;
      transportBody.tls = {
        ciphers: 'SSLv3'
      };
    }

    let transporter = nodemailer.createTransport( transportBody );

    console.log( '> MailUtil::send => Sending Email: ', to );

    await transporter.sendMail( {
      from: this.user,
      to,
      subject: subject,
      html: body,
    } );
  };
}
