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
        try {
          throw new Error();
        } catch ( e ) {
          let regExp = /(\w+)@|at (\w+) \(/g;
          let stack = e.stack;
          let callerMethod = regExp.exec( stack );

          if ( callerMethod ) {
            args.callerMethod = callerMethod[ 1 ] || callerMethod[ 2 ];
          } else {
            args.callerMethod = 'NonSpecifiedMethod';
          }
        }
      }

      const callerType = args.callerInstanceName
          ? args.callerInstanceName
          : args.callerInstance
              ? args.callerInstance.constructor.name
              : 'NonSpecifiedClass';

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
