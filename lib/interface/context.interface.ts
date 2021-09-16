/**
 * @description holds context interface
 */

import { UserRole } from '../enum/user-role.enum';
import { MessageQueueProvider } from '../provider/message-queue.provider';
import { MongoDbProvider } from '../provider/mongo.provider';
import { PostgreSqlProvider } from '../provider/postgre.provider';

export interface Context {
  mongodb_provider: MongoDbProvider;
  postgresql_provider: PostgreSqlProvider;
  role: UserRole;
  isAdmin: boolean;
  username: string;
  serviceKey: string;
  token: string;
  message_queue_provider: MessageQueueProvider;
}
