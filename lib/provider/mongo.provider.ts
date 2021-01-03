/**
 * @description holds mongodb connection provider
 */

import mongoose, { Connection } from 'mongoose';

export class MongoDbProvider {
  constructor(
    private uri: string,
    private poolLimit: number = 1,
    private connection: Connection = mongoose.createConnection()
  ) {}

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
      mongoose.connections.map(async (connection) => {
        if (connection) {
          await connection.close();
        }
      })
    );

    // create connection pool
    this.connection = await mongoose
      .createConnection(this.uri, {
        bufferCommands: false,
        bufferMaxEntries: 0,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        keepAlive: true,
        poolSize: this.poolLimit,
        socketTimeoutMS: 0,
      })
      .catch((error) => {
        throw error;
      });
  };

  /**
   * @returns connection
   */
  getConnection() {
    return this.connection;
  }
}
