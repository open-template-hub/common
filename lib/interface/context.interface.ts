/**
 * @description holds context interface
 */

import { UserRole } from '../enum/user-role.enum';
import { MessageQueueProvider } from '../provider/message-queue.provider';
import { MongoDbProvider } from '../provider/mongo.provider';
import { PostgreSqlProvider } from '../provider/postgre.provider';
import { EnvArgs } from './environment-args.interface';

export interface Context {
  mongodb_provider: MongoDbProvider;
  postgresql_provider: PostgreSqlProvider;
  role: UserRole;
  username: string;
  serviceKey: string;
  token: string;
  message_queue_provider: MessageQueueProvider;
}

export interface ContextArgs {
  req: any;
  envArgs: EnvArgs;
  mongodb_provider?: MongoDbProvider;
  postgresql_provider?: PostgreSqlProvider;
  message_queue_provider?: MessageQueueProvider;
}
