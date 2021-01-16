/**
 * @description holds Postgresql connection provider
 */

import { Pool, QueryResult } from 'pg';
import { EnvArgs } from '../interface/environment-args.interface';
import { BuilderUtil } from '../util/builder.util';
import { DebugLogUtil } from '../util/debug-log.util';

export class PostgreSqlProvider {
  constructor(
    private args: EnvArgs,
    private applicationName: string,
    private connectionPool: Pool = new Pool(),
    private debugLogUtil: DebugLogUtil = new DebugLogUtil(),
    private preloadTablesTemplatePath: string = './assets/sql/preload.tables.psql',
    private builder: BuilderUtil = new BuilderUtil()
  ) {}

  /**
   * preloads connection provider
   */
  preload = async () => {
    // Creating Connection Pool
    this.connectionPool = new Pool({
      connectionString: this.args.postgreSqlUri,
      application_name: this.applicationName,
      max: this.args.postgreSqlConnectionLimit
        ? parseInt(this.args.postgreSqlConnectionLimit)
        : 1,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    let queries = this.builder.buildTemplateFromFile(
      this.preloadTablesTemplatePath
    );

    return await this.query(queries, []);
  };

  /**
   * queries db
   * @param text query
   * @param params query parameters
   */
  query = async (text: string, params: Array<any>): Promise<any> => {
    const start = Date.now();

    const connectionPool = this.connectionPool;
    const debugLogUtil = this.debugLogUtil;

    return new Promise(function (resolve, reject) {
      connectionPool.query(
        text,
        params,
        (err: Error, res: QueryResult<any>) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            debugLogUtil.log('executed query', {
              sql: text,
              duration: Date.now() - start,
              result: res,
            });
            resolve(res);
          }
        }
      );
    });
  };
}
