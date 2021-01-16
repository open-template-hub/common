/**
 * @description holds logger util
 */

import { LogSeverity } from '../enum/log-severity.enum';

class LoggerUtil {
  log = (
    obj: any,
    severity: LogSeverity,
    message: string,
    args?: any,
    caller?: string
  ) => {
    try {
      if (!caller) {
        try {
          throw new Error();
        } catch (e) {
          var re = /(\w+)@|at (\w+) \(/g,
            st = e.stack,
            m;
          re.exec(st), (m = re.exec(st));
          if (m) {
            caller = m[1] || m[2];
          }
        }
      }

      const objType = obj.constructor.name;

      console.log(`${severity} | ${objType}::${caller} => ${message}`, args);
    } catch (e) {
      console.log(
        `${LogSeverity.MINOR} | LoggerUtil::log => Unexpected error occurred while logging. Error: ${e}`
      );
    }
  };
}

export const Logger = new LoggerUtil();
