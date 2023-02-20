/**
 * @description holds encryption util
 */

import crypto from 'crypto';
import CryptoJS from 'crypto-js';
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
      !this.args.tokenArgs?.responseEncryptionSecret
    )
      return args;

    for (let i = 0; i < args.length; i++) {
      let encrypted = CryptoJS.RC4.encrypt(
        args[i].toString(),
        this.args.tokenArgs?.responseEncryptionSecret
      );
      args[i] = JSON.stringify(encrypted);
    }

    return args;
  };

  /**
   * encrpyts object
   * @param obj Object
   */
  encryptObj = (obj: any) => {
    var objStr = JSON.stringify(obj);

    let encrypted = CryptoJS.RC4.encrypt(
      objStr,
      this.args.tokenArgs?.responseEncryptionSecret as string
    );

    return encrypted.toString();
  };

  /**
   * decrypts object
   * @param encryptedObj Encrypted Object String
   */
  decryptObj = (encryptedObj: string) => {
    let decrypted = CryptoJS.RC4.decrypt(
      encryptedObj,
      this.args.tokenArgs?.responseEncryptionSecret as string
    );

    var decryptedObj = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    return decryptedObj;
  };

  /**
   * decrypts text
   * @param encrypted_text
   */
  decrypt = (encrypted_text: string) => {
    if (!encrypted_text || !this.args.tokenArgs?.responseEncryptionSecret) {
      return encrypted_text;
    }

    const decrypted_text = CryptoJS.RC4.decrypt(
      encrypted_text,
      this.args.tokenArgs?.responseEncryptionSecret
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
