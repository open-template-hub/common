/**
 * @description holds error handler util
 */

import { EnvArgs } from '../..';
import { ErrorMessage, ResponseCode } from '../constant';
import { DebugLogUtil } from './debug-log.util';
import { EncryptionUtil } from './encryption.util';

export class ErrorHandlerUtil {

  debugLogUtil: DebugLogUtil;

  constructor( private args: EnvArgs ) {
    this.debugLogUtil = new DebugLogUtil();
  }

  /**
   * handles custom exceptions
   * @param exception exception
   */
  handle = ( exception: any ) => {
    let response = {
      code: ResponseCode.BAD_REQUEST,
      message: exception.message,
    };

    // Overwrite Response Code and Message here
    if ( exception.response ) {
      if ( exception.response.status ) {
        response.code = exception.response.status;
      }

      if ( exception.response.status !== ResponseCode.INTERNAL_SERVER_ERROR ) {
        try {
          let decrypted_data = new EncryptionUtil( this.args ).decrypt(
              exception.response.data
          );

          if ( decrypted_data?.message ) {
            response.message = decrypted_data.message;
          }
        } catch ( error ) {
          console.error( error );
        }
      }
    } else {
      if ( exception.responseCode ) {
        response.code = exception.responseCode;
      }

      if ( exception.message === ErrorMessage.FORBIDDEN ) {
        response.code = ResponseCode.FORBIDDEN;
      }
    }

    this.debugLogUtil.log( exception );
    console.error( response );

    return response;
  };
}
