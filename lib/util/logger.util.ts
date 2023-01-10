/**
 * @description holds logger util
 */

import { LogSeverity } from '../enum/log-severity.enum';
import { LogArgs } from '../interface/log-args.interface';

class LoggerUtil {
  /**
   * Log
   * @param args log args
   */
  log = ( args: LogArgs ) => {
    try {
      if ( !args.callerMethod ) {
        // https://sonarcloud.io/organizations/open-template-hub/rules?open=typescript%3AS5852&rule_key=typescript%3AS5852
        args.callerMethod = 'NonSpecifiedMethod';
      }

      let callerType;
      if ( args.callerInstanceName ) {
        callerType = args.callerInstanceName;
      } else if ( args.callerInstance ) {
        callerType = args.callerInstance.constructor.name;
      } else {
        callerType = 'NonSpecifiedClass';
      }

      console.log(
          `${ args.severity } | ${ callerType }::${ args.callerMethod } => ${ args.message }`,
          args.args ? args.args : ''
      );
    } catch ( e ) {
      console.log(
          `${ LogSeverity.MINOR } | LoggerUtil::log => Unexpected error occurred while logging: `,
          e
      );
    }
  };
}

export const Logger = new LoggerUtil();
