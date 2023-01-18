/**
 * @description holds mongodb connection provider
 */

import mongoose, { Connection } from 'mongoose';
import { EnvArgs } from '../interface/environment-args.interface';

export class MongoDbProvider {
  private connection: Connection;

  constructor(private args: EnvArgs) {
    this.connection = mongoose.createConnection();
  }

  /**
   * preloads connection provider
   */
  preload = () => {
    this.createConnectionPool();
  };

  /**
   * create connection pool
   */
  createConnectionPool = () => {
    // close open connections
    Promise.all(
      mongoose.connections.map(async (connection) => {
        if (connection) {
          await connection.close();
        }
      })
    ).then(() => {
      // create connection pool
      this.connection = mongoose.createConnection(
        this.args.dbArgs?.mongoDbUri as string,
        {
          keepAlive: true,
          maxPoolSize: this.args.dbArgs?.mongoDbConnectionLimit
            ? parseInt(this.args.dbArgs?.mongoDbConnectionLimit)
            : 1,
          socketTimeoutMS: 0,
        }
      );

      console.log("MongoDB Connection Pool Created Successfully.");
    });
  };

  /**
   * @returns connection
   */
  getConnection() {
    return this.connection;
  }
}
