import Redis from 'ioredis';
import { EnvArgs } from '../interface/environment-args.interface';

export class RedisProvider {
  private connection: any;
  constructor(private args: EnvArgs, private applicationName: string) {}

  preload = () => {
    this.connection = new Redis(this.args.dbArgs?.redisUri as string, {
      name: this.applicationName,
      sentinelMaxConnections: this.args.dbArgs?.redisConnectionLimit
        ? parseInt(this.args.dbArgs?.redisConnectionLimit)
        : 1,
    });
  };

  getConnection = () => {
    if (this.connection.status === 'disconnected') {
      this.connection.connect();
    }

    return this.connection;
  };

  releaseConnection = () => {
    try {
      this.connection.quit();
    } catch (e) {
      console.log('Error while releasing Redis connection: ', e);
    }
  };
}
