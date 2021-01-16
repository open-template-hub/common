/**
 * @description holds logger util
 */

import { LogSeverity } from '../enum/log-severity.enum';

class LoggerUtil {
  /**
   * Log
   * @param severity log severity
   * @param message log message
   * @param args log arguments
   * @param callerInstance log caller instance if exist
   * @param callerInstanceName log caller instance name, if you want to pass specific caller instance name
   * @param callerMethodName log caller method name, if you want to pass specific caller method name
   */
  log = (
    severity: LogSeverity,
    message: string,
    args?: any,
    callerInstance?: any,
    callerInstanceName?: string,
    callerMethod?: string
  ) => {
    try {
      if (!callerMethod) {
        try {
          throw new Error();
        } catch (e) {
          var re = /(\w+)@|at (\w+) \(/g,
            st = e.stack,
            m;
          re.exec(st), (m = re.exec(st));
          if (m) {
            callerMethod = m[1] || m[2];
          } else {
            callerMethod = 'NonSpecifiedMethod'
          }
        }
      }

      const callerType = callerInstanceName
        ? callerInstanceName
        : callerInstance
        ? callerInstance.constructor.name
        : 'NonSpecifiedClass';

      console.log(
        `${severity} | ${callerType}::${callerMethod} => ${message}`,
        args
      );
    } catch (e) {
      console.log(
        `${LogSeverity.MINOR} | LoggerUtil::log => Unexpected error occurred while logging. Error: ${e}`
      );
    }
  };
}

export const Logger = new LoggerUtil();
