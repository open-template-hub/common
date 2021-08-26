/**
 * @description holds usage util
 */

export class UsageUtil {
  /**
   * gets memory usage
   * @returns memory usage
   */
  getMemoryUsage = () => {
    return process.memoryUsage().heapUsed / 1024 / 1024;
  };
}
