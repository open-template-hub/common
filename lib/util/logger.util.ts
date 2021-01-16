/**
 * @description holds logger util
 */

import { LogSeverity } from '../enum/log-severity.enum';

class LoggerUtil {
  log = (obj: any, severity: LogSeverity, message: string) => {
    try {
      var caller = '';

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

      const objType = (typeof obj).toString();

      console.log(`${severity} | ${objType}::${caller} => ${message}`);
    } catch (e) {
      console.log(
        `${LogSeverity.MINOR} | LoggerUtil::log => Unexpected error occurred while logging. Error: ${e}`
      );
    }
  };
}

export const Logger = new LoggerUtil();
