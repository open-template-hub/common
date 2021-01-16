/**
 * @description holds encryption util
 */

import CryptoJS from 'crypto-js';
import crypto from 'crypto';
import { EnvArgs } from '../interface/environment-args.interface';

export class EncryptionUtil {
  constructor(private args: EnvArgs) {}

  /**
   * encrpyts response
   * @param args arguments
   */
  encrypt = (args: IArguments) => {
    if (
      args === undefined ||
      args === null ||
      !this.args.responseEncryptionSecret
    )
      return args;

    for (let i = 0; i < args.length; i++) {
      let encrypted = CryptoJS.RC4.encrypt(
        args[i].toString(),
        this.args.responseEncryptionSecret
      );
      args[i] = JSON.stringify(encrypted);
    }

    return args;
  };

  /**
   * decrypts text
   * @param encrypted_text
   */
  decrypt = (encrypted_text: string) => {
    if (!encrypted_text || !this.args.responseEncryptionSecret) {
      return encrypted_text;
    }

    const decrypted_text = CryptoJS.RC4.decrypt(
      encrypted_text,
      this.args.responseEncryptionSecret
    ).toString(CryptoJS.enc.Utf8);

    return JSON.parse(decrypted_text);
  };

  /**
   * hashes string with key
   * @param base_string base string
   * @param key key
   */
  hash_function_sha1(base_string: string, key: string) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  }
}
