/**
 * @description holds context interface
 */

import { UserRole } from '../enum/user-role.enum';
import { MessageQueueProvider } from '../provider/message-queue.provider';
import { MongoDbProvider } from '../provider/mongo.provider';
import { PostgreSqlProvider } from '../provider/postgre.provider';
import { RedisProvider } from '../provider/redis.provider';
import { EnvArgs } from './environment-args.interface';
import { Team } from './team.interface';

export interface Context {
  mongodb_provider: MongoDbProvider;
  postgresql_provider: PostgreSqlProvider;
  role: UserRole;
  username: string;
  serviceKey: string;
  token: string;
  message_queue_provider: MessageQueueProvider;
  teams: Team[];
}

export interface ContextArgs {
  req?: any;
  envArgs: EnvArgs;
  providerAvailability: ProviderAvailability;
  mongodb_provider?: MongoDbProvider;
  postgresql_provider?: PostgreSqlProvider;
  message_queue_provider?: MessageQueueProvider;
  redis_provider?: RedisProvider;
}

export interface ProviderAvailability {
  mongo_enabled: boolean;
  postgre_enabled: boolean;
  mq_enabled: boolean;
  redis_enabled: boolean;
}
