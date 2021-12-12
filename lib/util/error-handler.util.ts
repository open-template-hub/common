/**
 * @description holds error handler util
 */

import { Environment } from '../../../orchestration-server-template/environment';
import { ErrorMessage, ResponseCode } from '../constant';
import { DebugLogUtil } from './debug-log.util';
import { EncryptionUtil } from './encryption.util';

export class ErrorHandlerUtil {
  constructor( private debugLogUtil = new DebugLogUtil() ) {
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
      let decrypted_data = new EncryptionUtil( new Environment().args() ).decrypt(
          exception.response.data
      );

      if ( decrypted_data?.message ) {
        response.message = decrypted_data.message
      }

      if ( exception.response.status ) {
        response.code = exception.response.status;
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
