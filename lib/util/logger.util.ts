/**
 * @description holds logger util
 */

import { LogSeverity } from '../enum/log-severity.enum';

class LoggerUtil {
  log = (obj: any, severity: LogSeverity, message: string) => {
    var caller = this.log.caller.name;
    const objType = (typeof obj).toString();

    console.log(`${severity} | ${objType}::${caller} => ${message}`);
  };
}

export const Logger = new LoggerUtil();
