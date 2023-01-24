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

    this.connection.connect();
  };

  getConnection = () => {
    return this.connection;
  };

  releaseConnection = () => {
    this.connection.quit();
  };
}
