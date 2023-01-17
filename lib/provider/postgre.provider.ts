/**
 * @description holds Postgresql connection provider
 */

import { Pool, QueryResult } from 'pg';
import { EnvArgs } from '../interface/environment-args.interface';
import { BuilderUtil } from '../util/builder.util';
import { DebugLogUtil } from '../util/debug-log.util';

export class PostgreSqlProvider {

  private connectionPool: Pool;
  private debugLogUtil: DebugLogUtil;
  private preloadTablesTemplatePath: string;
  private builder: BuilderUtil;

  constructor( private args: EnvArgs, private applicationName: string ) {
    this.connectionPool = new Pool();
    this.debugLogUtil = new DebugLogUtil();
    this.preloadTablesTemplatePath = './assets/sql/preload.tables.psql';
    this.builder = new BuilderUtil();
  }

  /**
   * preloads connection provider
   */
  preload = () => {
    // Creating Connection Pool
    this.connectionPool = new Pool( {
      connectionString: this.args.dbArgs?.postgresqlUri,
      application_name: this.applicationName,
      max: this.args.dbArgs?.postgresqlConnectionLimit
          ? parseInt( this.args.dbArgs?.postgresqlConnectionLimit )
          : 1,
      ssl: {
        rejectUnauthorized: false,
      },
    } );

    let queries = this.builder.buildTemplateFromFile(
        this.preloadTablesTemplatePath
    );

    return this.query( queries, [] );
  };

  /**
   * queries db
   * @param text query
   * @param params query parameters
   */
  query = async ( text: string, params: Array<any> ): Promise<any> => {
    const start = Date.now();

    const connectionPool = this.connectionPool;
    const debugLogUtil = this.debugLogUtil;

    return new Promise( function ( resolve, reject ) {
      connectionPool.query(
          text,
          params,
          ( err: Error, res: QueryResult<any> ) => {
            if ( err ) {
              console.error( err );
              reject( err );
            } else {
              debugLogUtil.log( 'executed query', {
                sql: text,
                duration: Date.now() - start,
                result: res,
              } );
              resolve( res );
            }
          }
      );
    } );
  };
}
