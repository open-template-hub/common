/**
 * @description holds mongodb connection provider
 */

import mongoose, { Connection } from 'mongoose';
import { EnvArgs } from '../interface/environment-args.interface';

export class MongoDbProvider {
  constructor(
      private args: EnvArgs,
      private connection: Connection = mongoose.createConnection()
  ) {
  }

  /**
   * preloads connection provider
   */
  preload = async () => {
    await this.createConnectionPool();
  };

  /**
   * create connection pool
   */
  createConnectionPool = async () => {
    // close open connections
    await Promise.all(
        mongoose.connections.map( async ( connection ) => {
          if ( connection ) {
            await connection.close();
          }
        } )
    );

    // create connection pool
    this.connection = await mongoose
    .createConnection( this.args.mongoDbUri as string, {
      bufferCommands: false,
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      keepAlive: true,
      poolSize: this.args.mongoDbConnectionLimit
          ? parseInt( this.args.mongoDbConnectionLimit )
          : 1,
      socketTimeoutMS: 0,
    } )
    .catch( ( error ) => {
      throw error;
    } );
  };

  /**
   * @returns connection
   */
  getConnection() {
    return this.connection;
  }
}
